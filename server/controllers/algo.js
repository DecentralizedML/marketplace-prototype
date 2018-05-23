const AuthControllers = require('./auth');

const getUserFromAuth = AuthControllers.getUserFromAuth;

const {
  updateAlgo: updateAlgoInMongo,
} = require('../mongo');

const updateAlgo = async (req, res) => {
  if (!req.files) return res.status(400).send({ error: true, payload: 'File not found' });
  if (!req.body) return res.status(400).send({ error: true, payload: 'Account not found' });

  const {
    title,
    description,
    type,
    outputProcessing,
    account,
    address,
  } = req.body;

  if (!title || typeof title !== 'string') return res.status(400).send({ error: true, payload: 'Invalid title' });
  if (!description || typeof description !== 'string') return res.status(400).send({ error: true, payload: 'Invalid description' });
  if (!type || typeof type !== 'string') return res.status(400).send({ error: true, payload: 'Invalid type' });
  if (!outputProcessing || typeof outputProcessing !== 'string') return res.status(400).send({ error: true, payload: 'Invalid outputProcessing' });
  if (!address || typeof address !== 'string') return res.status(400).send({ error: true, payload: 'Invalid address' });

  try {
    const user = await getUserFromAuth(req);

    if (!user || user !== account) return res.status(401).send({ error: true, payload: 'User not athenticated' });

    const result = await updateAlgoInMongo({
      address,
      title,
      description,
      type,
      outputProcessing,
      creator: account,
    });

    res.send({ error: false, payload: result });
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }
};

module.exports = {
  updateAlgo,
};
