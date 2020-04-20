let socket;

// extract server url
const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://'+window.location.hostname;
// extract team name from the url /team/:name
const team = window.location.pathname.split("/")[2] || 'mainTeam';

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#eeeeee');
  cursor(CROSS);

  socket = io.connect(serverUrl);
  socket.on('connect', function() {
    console.log('Connected to team:', team);
    // connected, let's sign-up for to receive messages for this team
    socket.emit('team', team);
 });
  socket.on('mouse', drawOther);
}

function mouseDragged() {
  const data = {
    team: team,
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
  };
  // console.log('Sending: ' + mouseX + ',' + mouseY);
  // when we emit, need to emit the team variable
  socket.emit('mouse', data);

  // draw my mouse
  drawLine(mouseX, mouseY, pmouseX, pmouseY, 0);
}

function drawOther(data) {
  // console.log('Received: ', data);
  drawLine(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY, 0);
}

function drawLine(x1, y1, x2, y2, col) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let d = Math.sqrt(dx * dx + dy * dy) * 0.015;
  strokeWeight(0.5);
  stroke(col, (0.7 - d) * 255);
  line(x1, y1, x2, y2);
}

function draw() {}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
