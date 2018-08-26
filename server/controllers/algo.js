const AuthControllers = require('./auth');

const getUserFromAuth = AuthControllers.getUserFromAuth;

const {
  updateAlgo: updateAlgoInMongo,
  getAlgo: getAlgoFromMongo,
  uploadAlgoFile,
} = require('../mongo');

const updateAlgo = async (req, res) => {
  if (!req.files) return res.status(400).send({ error: true, payload: 'File not found' });
  if (!req.body) return res.status(400).send({ error: true, payload: 'Account not found' });

  const {
    title,
    description,
    type,
    outputProcessing,
    preprocessing,
    postprocessing,
    account,
    address,
  } = req.body;
  const { file } = req.files;

  if (!file) return res.status(400).send({ error: true, payload: 'File not found' });
  if (!title || typeof title !== 'string') return res.status(400).send({ error: true, payload: 'Invalid title' });
  if (!description || typeof description !== 'string') return res.status(400).send({ error: true, payload: 'Invalid description' });
  if (!type || typeof type !== 'string') return res.status(400).send({ error: true, payload: 'Invalid type' });
  if (!outputProcessing || typeof outputProcessing !== 'string') return res.status(400).send({ error: true, payload: 'Invalid outputProcessing' });
  if (!preprocessing || typeof preprocessing !== 'string') return res.status(400).send({ error: true, payload: 'Invalid preprocessing' });
  if (!postprocessing || typeof postprocessing !== 'string') return res.status(400).send({ error: true, payload: 'Invalid postprocessing' });
  if (!address || typeof address !== 'string') return res.status(400).send({ error: true, payload: 'Invalid address' });

  try {
    const user = await getUserFromAuth(req);

    if (!user || user !== account) return res.status(401).send({ error: true, payload: 'User not athenticated' });

    const link = await uploadAlgoFile(file);

    const result = await updateAlgoInMongo({
      address,
      title,
      description,
      type,
      outputProcessing,
      preprocessing,
      postprocessing,
      algoFileUrl: link,
      creator: account,
    });

    res.send({ error: false, payload: result });
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }
};

const getAlgo = async (req, res) => {
  const { algoAddress } = req.params;

  if (!algoAddress || typeof algoAddress !== 'string') return res.status(400).send({ error: true, payload: 'Invalid address' });

  try {
    const algo = await getAlgoFromMongo(algoAddress);
    res.send({ error: false, payload: algo });
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message });
  }
}

module.exports = {
  updateAlgo,
  getAlgo,
};
