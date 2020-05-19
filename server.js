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
  // once a client has connected ...
  // we expect to get a ping from them saying what team they want to join
  socket.on('team', function(team) {
    socket.join(team);
  });
  socket.on('mouse', data => {
    data['id'] = socket.id;
    // client broadcasts to other clients in this team excluding sender
    socket.in(data.team).broadcast.emit('mouse', data);
  });
});

// serve index.html from /team/:team
app.get('/team/:team', (req, res) => {
  res.sendFile('/public/index.html', { root: __dirname });
})
