const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 3000, function() {
  console.log(`Listening on port: ${server.address().port}`);
});
const io = socket(server);

app.use(express.static('public'));

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data) {
    //Broadcast to all clients
    //io.sockets.emit('mouse',data)
    //client broadcasts to other clients
    socket.broadcast.emit('mouse', data); //send the same message back out
    // console.log(data);
  }
}
