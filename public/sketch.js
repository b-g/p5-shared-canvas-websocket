const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://'+window.location.hostname;
let socket;

// Extract for team name from the url /team/:name
// (pretty hacky, should to a template and pass this variable from the server)
const team = window.location.pathname.split("/")[2] || 'mainTeam';
console.log('Connect to team: ', team);

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#eeeeee');
  cursor(CROSS);

  socket = io.connect(serverUrl);
  socket.on('connect', function() {
    // Connected, let's sign-up for to receive messages for this team
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
  // When we emit, need to emit the team variable
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
