if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

var squareSize = 10;

var points = [
  [ 1,  1,  1],
  [-1,  1,  1],
  [-1, -1,  1],
  [ 1, -1,  1],
  [ 1,  1, -1],
  [-1,  1, -1],
  [-1, -1, -1],
  [ 1, -1, -1]
];
var screenPoints = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
var lines = [
  [0, 1],
  [0, 4],
  [1, 2],
  [1, 5],
  [2, 3],
  [2, 6],
  [3, 0],
  [3, 7],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4]
];

var camera = {
  fov: 40,
  pos: [
    10,
    10,
    10,
  ],
  rotation: [
    54,
    0,
    135,
  ]
}

var screenWidth = 2 * Math.tan(rad(camera.fov) / 2);
var screenHeight = screenWidth * (h/w);

var lastTime = Date.now();
var time = 0;

var doRotate = false; //rotate the cube around the z axis
var doSpin = false; //rotate the cube around the camera z axis
var doScale = false; //scale the cube up by 50%
var doMove = false; //move the cube up by 2

var minDist = 10;
var maxDist = 20;
var colorChange = 80;

var animLength = 2000;

function easeQuad(b, c, t, d) {
  t /= d/2;
  
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
function easeQuad2(b, c, t) {
  if (t < 0.5) {
    t *= 4;
  
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  } else {
    t = 4 - t * 4;
    
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  }
}

function rad(deg) {
  return deg * Math.PI / 180.0;
}

function add(a, b) {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
  ]
}
function sub(a, b) {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ]
}
function scale(point, amount) {
  return [
    point[0] * amount,
    point[1] * amount,
    point[2] * amount
  ]
}
function divide(point, amount) {
  return [
    point[0] / amount,
    point[1] / amount,
    point[2] / amount
  ]
}
function normalize(point) {
  var len = Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
  return [
    point[0] / len,
    point[1] / len,
    point[2] / len
  ]
}
function rotateX(point, angle) {
  angle = angle * Math.PI / 180.0;
  return [
    point[0],
    (point[1] * Math.cos(angle)) - (point[2] * Math.sin(angle)),
    (point[1] * Math.sin(angle)) + (point[2] * Math.cos(angle))
  ]
}
function rotateY(point, angle) {
  angle = angle * Math.PI / 180.0;
  return [
    (point[0] * Math.cos(angle)) - (point[2] * Math.sin(angle)),
    point[1],
    (point[2] * Math.cos(angle)) - (point[0] * Math.sin(angle))
  ]
}
function rotateZ(point, angle) {
  angle = angle * Math.PI / 180.0;
  return [
    (point[0] * Math.cos(angle)) - (point[1] * Math.sin(angle)),
    (point[0] * Math.sin(angle)) + (point[1] * Math.cos(angle)),
    point[2]
  ]
}
function crossProduct(a, b) {
  return normalize([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]);
}

function toScreen(point, cam, ease1, ease2) {
  point = doScale ? scale(point, ease2 * 0.5 + 1) : point;
  point = doMove ? add(point, [0, 0, ease2 * 2]) : point;
  point = doRotate ? rotateZ(point, ease1 * 360) : point;
  
  var screenPoint = sub(point, cam.pos);
  
  screenPoint = rotateZ(screenPoint, cam.rotation[2] * -1);
  screenPoint = rotateY(screenPoint, cam.rotation[1] * -1);
  screenPoint = rotateX(screenPoint, cam.rotation[0] * -1);
  
  screenPoint = doSpin ? rotateZ(screenPoint, ease1 * 360) : screenPoint;
  
  return [
    ((screenPoint[0] / (screenPoint[2]) + screenWidth / 2) * (w/screenWidth)),
    ((screenPoint[1] / (screenPoint[2]) + screenHeight / 2) * (h/screenHeight)),
    Math.abs(screenPoint[2] * squareSize)
  ];
}

function drawLineX(line, xDist) {
  for (var j = 0; j < xDist; j++) {
    var dist = j / xDist;
    
    var brightness = (line[0][2] * (1 - dist)) + (line[1][2] * dist);
    brightness = Math.min(1, (Math.max(0, (brightness - minDist))/(maxDist - minDist)));
    brightness = ~~((brightness * colorChange) + 255 - colorChange);
    ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
    
    ctx.fillRect(
      (line[0][0] + j) * squareSize,
      Math.round((line[0][1] * (1 - dist)) + (line[1][1] * dist)) * squareSize,
      squareSize,
      squareSize
    );
  }
}
function drawLineY(line, yDist) {
  for (var j = 0; j < yDist; j++) {
    var dist = j / yDist;
    
    var brightness = (line[0][2] * (1 - dist)) + (line[1][2] * dist);
    brightness = Math.min(1, (Math.max(0, (brightness - minDist))/(maxDist - minDist)));
    brightness = ~~((brightness * colorChange) + 255 - colorChange);
    ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
    
    ctx.fillRect(
      Math.round((line[0][0] * (1 - dist)) + (line[1][0] * dist)) * squareSize,
      (line[0][1] + j) * squareSize,
      squareSize,
      squareSize
    )
  }
}


function render() {
  time = Math.min(animLength, Date.now() - lastTime);
  
  var ease1 = time / (animLength/2);
  ease1 = ease1 < 1 ? 0.5*ease1*ease1 : -0.5 * ((ease1-1)*(ease1-3) - 1);
  
  var ease2 = time / animLength;
  if (ease2 < 0.5) {
    ease2 *= 4;
    ease2 = ease2 < 1 ? 0.5*ease2*ease2 : -0.5 * ((ease2-1)*(ease2-3) - 1);
  } else {
    ease2 = 4 - ease2 * 4;
    ease2 = ease2 < 1 ? 0.5*ease2*ease2 : -0.5 * ((ease2-1)*(ease2-3) - 1);
  }
  
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgb(200, 200, 200)';
  
  for (var i = 0; i < points.length; i++) {
    screenPoints[i] = divide(toScreen(points[i], camera, ease1, ease2), squareSize);
    
    screenPoints[i][0] = ~~screenPoints[i][0];
    screenPoints[i][1] = ~~screenPoints[i][1];
  }
  for (var i = 0; i < lines.length; i++) {
    var line = [screenPoints[lines[i][0]], screenPoints[lines[i][1]]];
    Math.abs(line[0][0] - line[1][0]) >= Math.abs(line[0][1] - line[1][1]) ? drawLineX(line[0][0] > line[1][0] ? [line[1], line[0]]  : line, Math.abs(line[0][0] - line[1][0])) : drawLineY(line[0][1] > line[1][1] ? [line[1], line[0]] : line, Math.abs(line[0][1] - line[1][1]));
  }
  
  if (time >= animLength) {
    doRotate = Math.random() < 0.5 ? false : true;
    doSpin = Math.random() < 0.5 ? false : true;
    doScale = Math.random() < 0.5 ? false : true;
    doMove = Math.random() < 0.5 ? false : true;
    lastTime = Date.now();
  }
  requestAnimationFrame(render);
}

function onCanvasSizeChange() {
  //stupid solution to the cube being to small on mobile screens
  if (w < 800) {
    w = mW = canvas.width = 800;
    updateCanvasSize();
  }
  screenWidth = 2 * Math.tan(rad(camera.fov) / 2);
  screenHeight = screenWidth * (h/w);
  
  squareSize = Math.max(5, Math.round((w+h)/200));
  //because the line color is affected by z-depth, occasionally a few squares will be the wrong color, due to a line behind being drawn after one infront
  //instead of working out which lines are above/below eachother, simply setting the canvas to dark mode will use the darkest color drawn
  //this removes the need to sort by z-depth
  ctx.globalCompositeOperation = 'darken';
}
onCanvasSizeChange();

render();