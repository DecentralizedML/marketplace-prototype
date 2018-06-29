const bodyParser = require('body-parser');
const chalk      = require('chalk');
const dotenv     = require('dotenv');
const express    = require('express');
const fileUpload = require('express-fileupload');
const fs         = require('fs');
const path       = require('path');

const app    = express();
const port   = process.env.PORT || 8881;
const server = require('http').createServer(app);

let envFile = '.env.production';
if (process.env.NODE_ENV === 'development') envFile = '.env.development';
if (process.env.NODE_ENV === 'test')        envFile = '.env.test';

console.log(chalk.magenta.bold(`NODE_ENV : ${process.env.NODE_ENV}`));
console.log(chalk.magenta.bold(`ENV FILE : \`${envFile}\``));

// Load env vars from .env files (default to production)
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

const AuthControllers = require('./controllers/auth');
const AlgoControllers = require('./controllers/algo');

const getUserFromAuth = AuthControllers.getUserFromAuth;

const {
  insertJob,
  getActiveJob,
  getCompletedJobs,
  postJobResult,
  getJobs,
  // ready,
  updateBountyDetail,
  getBountyDetail,
  insertSubmission,
  getSubmissions,
  getSubmission,
} = require('./mongo');

const bucket = require('./file-upload').bountyBucket;

// const admin = require('firebase-admin');
// const config = require('./cert.json');
// admin.initializeApp({
//   credential: admin.credential.cert(config),
//   databaseURL: "https://decentralizedml-e05c9.firebaseio.com",
//   storageBucket: "bounty-submissions.appspot.com",
// });
// const bucket = admin.storage().bucket('bounty-submissions');

const jsonParser = bodyParser.json()

app.use(fileUpload());

const algos = {
  '551ac129ae81445c979eb18adc6c831a': {
    title: 'Fashion Items Scanner',
    thumbnail: 'https://d2ot5om1nw85sh.cloudfront.net/image/home/couple.jpg',
    stars: ' - ',
    description: 'Identify fashion items from image',
    downloads: 0,
    type: 'image_recognition',
    model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    isActive: true,
    cost: 1000000000000000000,
  },
  // '829ae96ed925455c9d1e420189cc4025': {
  //   title: 'Food Scanner',
  //   thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvISSPC8ve74437LCyc20FeJP3yDvVkRYRw2gV00fhMaVqN9N',
  //   type: 'twitter',
  //   model: '',
  //   stars: ' - ',
  //   description: 'Detect and identify if food in a picture',
  //   downloads: 0,
  //   isActive: true,
  // },
  // '8a6aaa36a54b41839d5858e7b7158c35': {
  //   title: 'Brand Scanner',
  //   thumbnail: 'https://bayintegratedmarketing.files.wordpress.com/2015/02/brands_montage_shadow.jpg?w=645',
  //   type: 'twitter',
  //   model: '',
  //   stars: ' - ',
  //   description: 'Detect and identify if any famous brand wording in a picture (Coke, Mac Donald, Dior, Channel, etc...)',
  //   downloads: 0,
  //   isActive: true,
  // },
  // '7653c938808b42acabf21198342e36a6': {
  //   title: 'Twitter Text Analysis',
  //   thumbnail: 'https://simplymeasured.com/wp-content/uploads/2013/01/twitter-stats.png',
  //   type: 'twitter',
  //   model: '',
  //   stars: ' - ',
  //   description: 'Analyse a text to provide the main sentiment (%) expressed in tweets',
  //   downloads: 0,
  //   isActive: false,
  // },
  // '2766eb9d2e35491196152dfe38a2fe6a': {
  //   title: 'Landmark Scanner',
  //   thumbnail: 'https://us.123rf.com/450wm/tomas1111/tomas11111505/tomas1111150500187/40392330-wide-shot-of-eiffel-tower-with-dramatic-sky-paris-france.jpg?ver=6',
  //   type: 'twitter',
  //   model: '',
  //   stars: ' - ',
  //   description: 'Detect and identify if any worldwide famous landmark (eiffel tower, big ben, taj mahal, etc...)',
  //   downloads: 0,
  //   isActive: true,
  // },
  'd766f1471d6149a8995530432d94f51f': {
    title: 'IMDB Sentiment Analyzer',
    thumbnail: 'https://oikonomos.ca/wp-content/uploads/2017/08/shutterstock_132875531-700x466.jpg',
    type: 'text',
    model: 'https://transcranial.github.io/keras-js-demos-data/imdb_bidirectional_lstm/imdb_bidirectional_lstm.bin',
    stars: ' - ',
    description: 'Determine sentiment from movie reviews.',
    downloads: 0,
    isActive: true,
    cost: 1000000000000000000,
  },
  // '342854517afc476a8f6a35722f379e49': {
  //   title: 'Animal\'s Breed Identifier',
  //   thumbnail: 'https://images.wagwalkingweb.com/media/articles/dog/pancreatic-exocrine-neoplasia/pancreatic-exocrine-neoplasia.jpg',
  //   stars: ' - ',
  //   description: 'Identify animal\'s breeds in your picture.',
  //   downloads: 0,
  //   type: 'image_recognition',
  //   model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
  //   isActive: false,
  // },
  'e065b40c287b4c2daf2a25be8df2f186': {
    title: 'Tools Identifier',
    thumbnail: 'https://cimg2.ibsrv.net/cimg/www.doityourself.com/660x300_100-1/514/Tools-199514.jpg',
    stars: ' - ',
    description: 'Identify tools in your picture.',
    downloads: 0,
    type: 'image_recognition',
    model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    isActive: false,
    cost: 1000000000000000000,
  },
};

// Auth Controllers
app.post('/get_seed', jsonParser, AuthControllers.getSeed);
app.post('/authenticate', jsonParser, AuthControllers.authenticate);
app.post('/signup', jsonParser, AuthControllers.signup);
app.get('/get_user', AuthControllers.fetchUser);

// Algo Controllers
app.post('/algorithms/:algoAddress', AlgoControllers.updateAlgo);
app.get('/algorithms/:algoAddress', AlgoControllers.getAlgo);

app.post('/createJob', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const { reward, algo_id, requestor } = body;

  const algo = algos[algo_id];

  if (!algo) return res.status(400).send({ error: true, payload: `Cannot find algorithm by id: ${algo_id}` });
  if (!requestor || typeof requestor !== 'string') return res.status(400).send({ error: true, payload: 'requestor must be string' });
  if (reward <= 0 || typeof reward !== 'number') return res.status(400).send({ error: true, payload: 'reward must be number' });
  if (!algo || !requestor || !reward || typeof requestor !== 'string' || typeof reward !== 'number') {
    return res.sendStatus(400);
  }

  const job = {
    reward,
    requestor,
    algo_id,
    completed: {},
  };

  try {
    const result = await insertJob(job)
    res.send({ error: false, payload: result })
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }

});

app.get('/algorithms', (req, res) => {
  res.send({
    algos: Object.entries(algos)
      .map(([ key, value ]) => ({
        algo_id: key,
        ...value
      })),
  });
});

app.post('/get_active_job', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const { user_public_key } = body;

  if (!user_public_key || typeof user_public_key !== 'string') return res.status(400).send({ error: true, payload: `Invalid publick key: ${user_public_key}`});

  try {
    const result = await getActiveJob(user_public_key)
    res.send({ error: false, payload: result })
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }

});

app.post('/get_completed_jobs', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const { user_public_key } = body;

  if (!user_public_key || typeof user_public_key !== 'string') return res.status(400).send({ error: true, payload: `Invalid publick key: ${user_public_key}`});

  try {
    const result = await getCompletedJobs(user_public_key)
    res.send({ error: false, payload: result })
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }

});

app.post('/job_result', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const {
    job_id,
    user_public_key,
    results,
  } = body;

  if (!results || !results.length) return res.status(400).send({ error: true, payload: 'results must not be empty' });
  if (!user_public_key || typeof user_public_key !== 'string') return res.status(400).send({ error: true, payload: `Invalid publick key: ${user_public_key}`});

  try {
    const result = await postJobResult({ job_id, user_public_key, results })
    res.send({ error: false, payload: result })
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }

});

app.post('/get_job_history_by_algo', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const {
    algo_id,
    requestor,
  } = body;

  if (!algo_id || typeof algo_id !== 'string') return res.status(400).send({ error: true, payload: `Invalid algo_id: ${algo_id}`});
  if (!requestor || typeof requestor !== 'string') return res.status(400).send({ error: true, payload: `Invalid requestor: ${requestor}`});

  try {
    const result = await getJobs({ algo_id, requestor });
    res.send({ error: false, payload: result });
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }
});

app.get('/submissions/:address', async (req, res) => {
  const { address } = req.params;

  if (!address) return res.status(400).send({ error: true, payload: 'Address not found' });

  try {
    const data = await getSubmissions(address);
    res.send({ error: false, payload: data });
  } catch (e) {
    res.status(500).send({ error: true, payload: e.message });
  }
});

app.post('/get_submission', jsonParser, async (req, res) => {
  if (!req.body) return res.status(400).send({ error: true, payload: 'Account not found' });

  try {
    const { filename, account, _id, address } = req.body;
    const user = await getUserFromAuth(req);

    if (!user || user !== account) return res.status(401).send({ error: true, payload: 'User not athenticated' });

    const entry = await getSubmission(_id);

    if (entry.submittedBy !== user) {
      return res.status(401).send({ error: true, payload: 'User not athenticated' });
    }

    const file = bucket.file(decodeURIComponent(filename));

    await file.download({
      destination: filename,
    });

    res.sendFile(process.cwd() + '/' + filename);

    setTimeout(() => deleteFile(process.cwd() + '/' + filename), 5000);
  } catch (e) {
    res.status(500).send({ error: false, payload: e.message });
  }
});

app.post('/bounty/:address/upload', async (req, res) => {
  if (!req.files) return res.status(400).send({ error: true, payload: 'File not found' });
  if (!req.body) return res.status(400).send({ error: true, payload: 'Account not found' });

  const { file } = req.files;
  const { address } = req.params;
  const { account } = req.body;

  if (!file) return res.status(400).send({ error: true, payload: 'File not found' });
  if (!address) return res.status(400).send({ error: true, payload: 'Address not found' });

  try {
    const user = await getUserFromAuth(req);

    if (!user || user !== account) return res.status(401).send({ error: true, payload: 'User not athenticated' })

    const filepath = await writeFile(file);
    const uploadResponse = await bucket.upload(filepath);

    await deleteFile(filepath);

    const link = uploadResponse[0].metadata.selfLink;
    const insertResponse = await insertSubmission({
      address,
      link,
      submittedBy: account,
      timestamp: new Date().getTime(),
    });

    res.send({ error: false, payload: insertResponse });
  } catch (e) {
    res.status(500).send({ error: true, payload: e.message });
  }
});

function writeFile(file) {
  const time = new Date().getTime();
  const filename = `${time}-${file.name}`;
  const filepath = process.cwd() + '/' + filename;
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, file.data, err => {
      if (err) {
        return reject(err);
      }

      return resolve(filepath);
    });
  });
}

function deleteFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) {
        return reject(err);
      }

      return resolve(filepath);
    });
  });
}

app.get('/bounty_detail/:address?', async (req, res) => {
  const { address } = req.params;

  if (!address || typeof address !== 'string') {
    return res.status(400).send({ error: true, payload: `Invalid address: ${address}`});
  }
  try {
    const result = await getBountyDetail(address);
    res.send({ error: false, payload: result });
  } catch (err) {
    if ((/Cannot find bounty address/gi).test(err.message)) {
      res.status(200).send({ error: true, payload: err.message })
      return;
    }
    res.status(500).send({ error: true, payload: err.message })
  }
});

app.post('/update_bounty_detail/:address', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const {
    thumbnailUrl,
    imageUrl,
    subtitle,
    description,
    data,
    evaluation,
    rules,
    address,
    account,
  } = body;

  if (!thumbnailUrl || typeof thumbnailUrl !== 'string') return res.status(400).send({ error: true, payload: 'Invalid thumbnailUrl' });
  if (!imageUrl || typeof imageUrl !== 'string') return res.status(400).send({ error: true, payload: 'Invalid imageUrl' });
  if (!description || typeof description !== 'string') return res.status(400).send({ error: true, payload: 'Invalid description' });
  if (!subtitle || typeof subtitle !== 'string') return res.status(400).send({ error: true, payload: 'Invalid thumbnailUrl' });
  if (!data || typeof data !== 'string') return res.status(400).send({ error: true, payload: 'Invalid data' });
  if (!evaluation || typeof evaluation !== 'string') return res.status(400).send({ error: true, payload: 'Invalid evaluation' });
  if (!rules || typeof rules !== 'string') return res.status(400).send({ error: true, payload: 'Invalid rules' });
  if (!address || typeof address !== 'string') return res.status(400).send({ error: true, payload: 'Invalid address' });

  try {
    const user = await getUserFromAuth(req);

    if (!user || user !== account) return res.status(401).send({ error: true, payload: 'User not athenticated' });

    const result = await updateBountyDetail({
      thumbnailUrl,
      imageUrl,
      subtitle,
      description,
      data,
      evaluation,
      rules,
      address,
    });
    res.send({ error: false, payload: result });
  } catch (err) {
    res.status(500).send({ error: true, payload: err.message })
  }
});


app.use(express.static(path.join(__dirname, '../build')));

server.listen(port, () => console.log(`Listening on port ${port}`));
