const express = require('express');

const app = express();
const server = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 5000;
const io = require('socket.io')(server);

io.on('connection', socket => {
  
});

app.use(express.static(path.join(__dirname, '../build')));

server.listen(port, () => console.log(`Listening on port ${port}`));
