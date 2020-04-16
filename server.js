const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${server.address().port}`);
});
const io = socket(server);

app.use(express.static('public'));

io.sockets.on('connection', socket => {
  console.log('new connection: ' + socket.id);
  socket.on('mouse', data => {
    // broadcast to all clients including initial sender
    // io.sockets.emit('mouse', data)

    // client broadcasts to other clients excluding sender
    socket.broadcast.emit('mouse', data);
  });
});
