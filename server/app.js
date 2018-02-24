const express = require('express');
const uuid = require('uuid4');
var ObjectId = require('mongodb').ObjectId;
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 8881;
const bodyParser = require('body-parser');
const { insertJob, getActiveJob, getCompletedJobs, postJobResult, getJobs, ready } = require('./mongo');

const jsonParser = bodyParser.json()

const algos = {
  'd766f147-1d61-49a8-9955-30432d94f51f': {
    title: 'IMDB Sentiment Analyzer',
    thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
    type: 'text',
    model: 'https://transcranial.github.io/keras-js-demos-data/imdb_bidirectional_lstm/imdb_bidirectional_lstm.bin',
    stars: 4.8,
    description: 'Determine sentiment from movie reviews.',
    downloads: 438,
  },
  '34285451-7afc-476a-8f6a-35722f379e49': {
    title: 'Animal\'s Breed Identifier',
    thumbnail: 'https://images.wagwalkingweb.com/media/articles/dog/pancreatic-exocrine-neoplasia/pancreatic-exocrine-neoplasia.jpg',
    stars: 3.74,
    description: 'Identify animal\'s breeds in your picture.',
    downloads: 7629,
    type: 'image_recognition',
    model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
  },
  'e065b40c-287b-4c2d-af2a-25be8df2f186': {
    title: 'Tools Identifier',
    thumbnail: 'https://cimg2.ibsrv.net/cimg/www.doityourself.com/660x300_100-1/514/Tools-199514.jpg',
    stars: 3.91,
    description: 'Identify tools in your picture.',
    downloads: 602,
    type: 'image_recognition',
    model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
  },
  '551ac129-ae81-445c-979e-b18adc6c831a': {
    title: 'Fashion Items Scanner',
    thumbnail: 'https://d2ot5om1nw85sh.cloudfront.net/image/home/couple.jpg',
    stars: 4.76,
    description: 'Identify fashion items from image',
    downloads: 12901,
    type: 'image_recognition',
    model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
  },
};

app.post('/createJob', jsonParser, async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).send({ error: true, payload: 'Cannot parse json body.' });
  }

  const { reward, algo_id, requestor } = body;

  const algo = algos[algo_id];

  if (!algo) return res.status(400).send({ error: true, payload: `Cannot find algorithmn by id: ${algo_id}` });
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

app.get('/algorithmns', (req, res) => {
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


app.use(express.static(path.join(__dirname, '../build')));

server.listen(port, () => console.log(`Listening on port ${port}`));
