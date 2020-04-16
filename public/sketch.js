let socket;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#eeeeee');

  socket = io.connect('http://' + window.location.hostname);
  socket.on('mouse', drawOther);
}

function mouseDragged() {
  const data = {
    x: mouseX,
    y: mouseY
  };
  // console.log('Sending: ' + mouseX + ',' + mouseY);
  socket.emit('mouse', data);

  // draw my mouse
  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 3, 3);
}

function drawOther(data) {
  // console.log('Received: ', data);
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 3, 3);
}

function draw() {}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
