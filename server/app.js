const express = require('express');
const uuid = require('uuid4');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 8881;
const io = require('socket.io')(server);

const marketers = {};
const marketersByKey = {};
const users = {};
const usersByKey = {};
const jobs = {};

io.on('connection', socket => {
  const { id } = socket;

  socket.on('add corporate user', ({ account }) => {
    console.log(`New corporate user joined: ${id}`);
    marketers[id] = {
      account
    };
    marketersByKey[account] = id;
    Object.entries(marketers)
      .forEach(([userId, user]) => {
        const userSocket = io.sockets.sockets[userId];
        userSocket.emit('hello', { hi: 1 })
      });
  });


  socket.on('add mobile user', ({ account }) => {
    console.log(`New mobile user joined: ${id}`);
    users[id] = {
      account
    };
    usersByKey[account] = id;
  });

  socket.on('receive result', ({ jobId, result }) => {
    const job = jobs[jobId];

    if (!job) {
      return;
    }

    const user = users[id] || {};
    const account = user.account;

    if (!account) {
      return;
    }

    job.results[account] = result;

    if (job.needed <= Object.keys(marketers).length) {
      const marketerSocket = io.sockets.sockets[job.requestor];

      if (!marketerSocket) return;
      
      marketerSocket.emit('job completed', job);
    }

  });

  socket.on('add job', ({ algo }) => {
    const jobId = uuid();
    console.log(`Added new job: ${jobId}`);

    jobs[jobId] = {
      algo,
      results: {},
      needed: Object.keys(marketers).length,
    };

    Object.entries(users)
      .forEach(([userId, user]) => {
        const userSocket = io.sockets.sockets[userId];
        userSocket.emit('run job', {
          algo,
        });
      });
  });


  socket.on('disconnect', () => {
    console.log(`Bye ${id}`);
    const { account } = marketers[id] || {};
    const { account: userAccount } = users[id] || {};
    
    if (account) {
      delete marketers[id];
    }

    if (marketersByKey[account]) {
      delete marketersByKey[account];
    }

    if (userAccount) {
      delete users[id];
    }

    if (usersByKey[userAccount]) {
      delete usersByKey[userAccount];
    }

  })
});

app.get('/jobs', (req, res) => {
  res.send({
    jobs: [
      {
        jobId: 'abc',
        algo: 'fashion',
        reward: 100,
        name: 'Fashion Items Scanner',
        description: 'Identify fashion items from image',
      },
      {
        jobId: 'def',
        algo: 'dog',
        reward: 100,
        name: 'Dog Scanner',
        description: 'Identify dogs from image',
      },
    ],
  });
});

app.use(express.static(path.join(__dirname, '../build')));

server.listen(port, () => console.log(`Listening on port ${port}`));
