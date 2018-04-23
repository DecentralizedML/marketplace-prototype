const uuid = require('uuid4');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');

// In-Memory Seeds storage
// This will only live in memory for less than 5 seconds
const seeds = {};

const getSeed = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  if (!body.account) {
    return res.status(400).send({ error: true, payload: 'Account address is invalid.' });
  }

  const seed = uuid();

  seeds[body.account] = seed;

  return res.send({ error: false, payload: seed });
};

const authenticate = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const { sig, account } = body;

  if (!sig) return res.state(400).send({ error: true, payload: 'Signed secret is not found.' });
  if (!account) return res.state(400).send({ error: true, payload: 'Account address is invalid.' });

  const pk = getPublicKeyFromSignedMessage(sig, account);
  
  if (pk === account) {
    res.send({ error: false, payload: createJWT(pk) });
  } else {
    res.state(500).send({ error: true, payload: 'Error authenticating user' });
  }
}

module.exports = {
  getSeed,
  authenticate,
  getUserFromAuth,
};

function createJWT(publicKey) {
  // If the signature matches the owner supplied, create a
  // JSON web token for the owner that expires in 24 hours.
  try {
    const token = jwt.sign({ user: publicKey }, getSecret(),  { expiresIn: '1d' });
    return token;
  } catch (e) {
    throw new Error('Cannot create JWT');
  }
}

function getPublicKeyFromSignedMessage(sig, account) {
  try {
    // Same data as before
    const data = seeds[account];
    console.log({ data })
    const message = ethUtil.toBuffer(data)
    const msgHash = ethUtil.hashPersonalMessage(message)

    // Get the address of whoever signed this message
    const signature = ethUtil.toBuffer(sig)
    const sigParams = ethUtil.fromRpcSig(signature)
    const publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s)
    const sender = ethUtil.publicToAddress(publicKey)
    const addr = ethUtil.bufferToHex(sender)
    delete seeds[account];
    return addr;
  } catch (e) {
    throw new Error('Cannot recover public key');
  }
}

function getUserFromAuth(req) {
  return new Promise((resolve, reject) => {
    try {
      const { authorization } = req.headers;
      const token = jwt.verify(authorization, getSecret());
      const { user } = token;
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
}

function getSecret() {
  return `
    1842121932
    4892791267
    9212093463
    3516681983
    4809163974
    8523353727
    7975240046
    7714453299
    9173909644
    4069221049
  `;
}
