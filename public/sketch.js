// extract server url
const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://' + window.location.hostname;
// extract team name from the url /team/:name
const team = window.location.pathname.split("/")[2] || 'all-together';
// websocket
let socket;

// pen colors
const colors = ['⚫️', '🔴', '🔵', '🟢', '🟡', '⚪️'];
let activeColor = colors[0];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(247);
  cursor(CROSS);
  frameRate(30);

  socket = io.connect(serverUrl);
  socket.on('connect', function() {
    console.log('Connected to team:', team);
    // connected, let's sign-up for to receive messages for this team
    socket.emit('team', team);
  });
  socket.on('mouse', drawOther);

  // setup pen color menu
  $('#pen').click(function(event) {
    const currentColor = $('#color').text();
    const i = colors.indexOf(currentColor);
    activeColor = colors[(i + 1) % colors.length];
    $('#color').text(activeColor);
  })
  // set default color
  $('#color').text(activeColor);

}

function mouseDragged() {
  const data = {
    team: team,
    color: activeColor,
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
    mousePressed: true
  };
  // console.log('Sending: ' + mouseX + ',' + mouseY);
  // when we emit, need to emit the team variable
  socket.emit('mouse', data);

  // draw my mouse
  drawLine(mouseX, mouseY, pmouseX, pmouseY, activeColor);
}

function mouseReleased(){
  const data = {
    team: team,
    color: activeColor,
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
    mousePressed: false
  };
  socket.emit('mouse', data);
}

function drawOther(data) {
  // console.log('Received: ', data);
  drawLine(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY, data.color);
  drawOtherCursor(data);
}

function drawOtherCursor(data) {
  const $cursors = $('#cursors');
  let $circle = $(`#cursors #${data.id}`);

  if ($circle.length > 0) {
    // set cursor position
    $circle.attr({
      cx: data.mouseX,
      cy: data.mouseY,
    });
    // show/hide cursor on mousePressed
    if (data.mousePressed) $circle.show();
    else $circle.hide();

  } else {
    // create cursor
    $circle = $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
      cx: data.mouseX,
      cy: data.mouseY,
      r: 4,
      stroke: 'black',
      strokeWidth: 0.3,
      fill: 'none',
      id: data.id
    });
    $cursors.append($circle);
  }
}

function drawLine(x1, y1, x2, y2, col) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let d = Math.sqrt(dx * dx + dy * dy) * 0.015;
  d = Math.min(0.65, d);
  // '⚫️', '⚪️', '🔴', '🔵', '🟢', '🟡'
  switch (col) {
    case '⚫️':
      strokeWeight(0.75);
      stroke(0, (0.7 - d) * 255);
      break;
    case '⚪️':
      strokeWeight(1);
      stroke(255, (1 - d) * 255);
      break;
    case '🔴':
      strokeWeight(0.5);
      stroke(255, 0, 0, (0.9 - d) * 255);
      break;
    case '🔵':
      strokeWeight(0.5);
      stroke(0, 0, 255, (0.9 - d) * 255);
      break;
    case '🟢':
      strokeWeight(0.5);
      stroke(0, 255, 0, (0.9 - d) * 255);
      break;
    case '🟡':
      strokeWeight(1.0);
      stroke(255, 255, 0, (1 - d) * 255);
      break;
  }
  line(x1, y1, x2, y2);
}

function draw() {}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
