const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${server.address().port}`);
});
app.use(express.static('public'));
app.use(bodyParser.json());

const io = socket(server);

io.sockets.on('connection', socket => {
  console.log('new connection: ' + socket.id);
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('room', function(room) {
    socket.join(room);
  });
  socket.on('mouse', data => {
    // client broadcasts to other clients in this room excluding sender
    socket.in(data.room).broadcast.emit('mouse', data);
  });
});

// serve index.html from /team/:room
app.get('/team/:room', (req, res) => {
  // Here if we use some templating system like Pug or Ejs, could pass the room variable to the view
  // var room = req.params.room
  res.sendFile('/public/index.html', { root: __dirname });
})
