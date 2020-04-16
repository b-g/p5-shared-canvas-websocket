let socket;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#eeeeee');
  cursor(CROSS);

  socket = io.connect('http://' + window.location.hostname);
  socket.on('mouse', drawOther);
}

function mouseDragged() {
  const data = {
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
  };
  // console.log('Sending: ' + mouseX + ',' + mouseY);
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
