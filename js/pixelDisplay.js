// ==========================================
var centerX = 0;
var centerY = 0;
var pixelWidth = 14; //px, with margin
var pW = pixelWidth; //for shortcut
var display = document.querySelector('div.display');
var displayX = display.offsetLeft;
var displayY = display.offsetTop;
var batch = []; //array of coordinates
var pixels; // Array of all the pixels
var position; // Array of pixel's positions at various points in time
var coeX = [];
var coordinates = {}; // Object for all symbols coordinates
var widths = {}; // Object for all symbols widths
var readyInput = []; // List of symbols to display
var localData = {
  'settings'  : null,
  'symbols'   : null,
  'symbolsParsed' : null
}
// Objects holding data about symbols
var dictionary = [];
var coordinates = {};
var widths = {};

// ==========================================
// SETTINGS
var keys = ['scale','rand','range','density','speed']
var setup = {
  'scale'   : 1, //
  'rand'    : 0.15, // Probability of random movements
  'range'   : 0.6, // How much moves pixels make
  'density' : 1, // Pixels number multiplier
  'speed'   : 30 // Pixel movements per second
}
// ==========================================
// Convert server response to a more convenient format
// and aggregate it in appropariate variables.
function adaptServerData() {
  dictionary = []; // Clear dictionary
  coordinates = {}; //Clear coordinates
  widths = {};
  var data = localData.symbols;
  for (var i = 0; i < data.length; i++) {
    var coordsX = JSON.parse('[' + data[i][2] + ']');
    var coordsY = JSON.parse('[' + data[i][3] + ']');
    var coords = [];
    for (var j = 0; j < coordsX.length; j++) {
      cache = [coordsX[j],coordsY[j]];
      coords.push(cache);
    }
    var symbolCode = data[i][1];
    var width = textWidth(coords);
    // Append symbol to the dictionary
    dictionary.push(symbolCode);
    // Append symbol with its coordinates to aggregate list
    Object.defineProperty(coordinates, symbolCode, {
      value: coords
    });
    // Append symbol with its width value to aggregate list
    Object.defineProperty(widths, symbolCode, {
      value: width
    });
  }
}
// ========================================
// Scan text for known codenames of symbols
function evaluateInputText() {
  target = document.querySelector('#textInput');
  var text = target.value;
  readyInput = [];
  for (var i = 0; i < text.length; i++) {
    var symbol = text[i];
    // '<' indicate code for special symbol
    // unless escaped with '<' itself
    if (symbol == '<') { //Special symbol case
      var codeStart = i;
      var codeEnd = text.indexOf('>',codeStart);
      var code = text.substring(codeStart + 1,codeEnd);
      // If '>' was not found code == '', and also
      // code for special symbol can't have ' ' in it
      // so in this case '<' is just regular symbol
      if (code == '' || code.indexOf(' ') != -1) {
        var fail = true;
        break
      }
      var index = dictionary.indexOf(code);
      readyInput.push(code);
      i = i + code.length + 1; //Skip next few symbols
    }
    else if (true || fail) { //Regular symbol case
      var index = dictionary.indexOf(symbol);
      readyInput.push(symbol);
    }
    if (index == -1) { //Invalid input case
      var msg = (code == 'undefined' ? symbol : code);
      return console.log('Unrecognized symbol/code: '+ msg +'.');
    }
  }
  // Proceed to the next operation
  createBatch(readyInput);
}
// ==========================================
// Compile all the letters into one set of
// coordinates.
// text = readyInput
function createBatch(text) {
  batch = []; //Clear batch
  var textLen = 0;
  for (var i = 0; i < text.length; i++) { //Each symbol
    var coords = []
    var symbol = coordinates[text[i]];
    for (var j = 0; j < symbol.length; j++) { //Each pixel
      coords.push([symbol[j][0],symbol[j][1]]); //save coords
      coords[j][0] += textLen; //push symbol to the end of text
    }
    batch.push.apply(batch, coords); //Append batch
    textLen += widths[text[i]]; //Bump up total width
  }
  // Call function to draw pixels
  layout(batch,-textWidth(batch)/2,-overBaseTextHeight(batch)/2);
  // layout(batch,-textWidth(batch)/2,0);
}
// ==========================================
function overBaseTextHeight(array) {
// Go through 'y' coordinates and find
// and compare their extreme values
  var maxY, minY;
  for (var i = 0; i < array.length; i++) {
    var y = array[i][1]; //First pixel, second coordinate
    if (i == 0) {maxY = y; minY = y}
    if (maxY < y) maxY = y
    if (minY > y) minY = y
  }
  var height = maxY; // <-----
  return height + 1; //y = 0 gives 1 in height
}
// ==========================================
function textHeight(array) {
// Go through 'y' coordinates and find
// and compare their extreme values.
  var maxY, minY;
  for (var i = 0; i < array.length; i++) {
    var y = array[i][1]; //First pixel, second coordinate
    if (i == 0) {maxY = y; minY = y}
    if (maxY < y) maxY = y
    if (minY > y) minY = y
  }
  var height = maxY - Math.min(minY,0); // <-----
  return height + 1; //y = 0 gives 1 in height
}
// ==========================================
function textWidth(array) {
  var maxX, minX;
  for (var i = 0; i < array.length; i++) {
    var x = array[i][0]; //First pixel, first coordinate
    if (i == 0) {maxX = x; minX = x}
    if (maxX < x) maxX = x
    if (minX > x) minX = x
  }
  var width = maxX - minX;
  return width + 1; //x = 0 gives 1 in height
}
// ==========================================
function layout(el,shift_x,shift_y) {
// Create pixels for given element based on 'el'
// and move them all to proper location defined
// in global coordinates (.display = 0,0).
  removePixels();
  for (var i = 0; i < el.length; i++) {
    // Create pixels:
    var pixel = document.createElement('div');
    // NOTE: here possibly assign some identifiers
    pixel.classList.add('pixel');
    display.appendChild(pixel);
    // Adjust position:
    var x = el[i][0] + shift_x;
    var y = el[i][1] + shift_y;
    pixel.style.left = x*pW + 'px';
    pixel.style.bottom = y*pW + 'px';
  }
}
// ==========================================
function mkArray(a,b,c) {
// Create multidimensional array.
// It is helpful as it is not possible to create arrays
// in javascript in implicit way just by referencing desired
// dimension.
// a x b x c
  var array = [];
  for (var i = 0; i < a; i++) {
    array[i] = [];
    if (c > 1) {
      for (var j = 0; j < b; j++) {
        array[i][j] = [];
      }
    }
  }
  return array;
}
// ========================================
function applyForce(i,j,id,fps) {
  // Check if pixel is within influence area of the force
  var pixelX = position[i][j][0]*pixelWidth;
  var pixelY = position[i][j][1]*pixelWidth;
  var velocity = velocities[0] || 0;
  var forceX = prop.position[0];
  var forceY = prop.position[1];
  // Pixel position in force coordinates system
  var localX = pixelX - forceX;
  var localY = pixelY - forceY;
  // Perimeters of influence area
  var relAngRange1 = toRelAngle(forces[id].rad1);
  var relAngRange2 = toRelAngle(forces[id].rad2);
  // Relative angle of vector pointing to the pixel
  var angle = relativeAngle([localX, localY]);
  // Check
  if (absRange2>absRange1) {
    if (angle > relAngRange1 && angle < relAngRange2) {
      return
    }
  }
  else {
    if (angle > relAngRange1 || angle < relAngRange2) {
      return
    }
  }
  // ---Conditions are met---
  // ---------------------------------
  // ----Apply force----
  var value = forces[id].value;
  var speed = setup.speed;
  if (forces[id].type === 1) { // Radial force
    var length = vectorLength([localX,localY]);
    var incrementX = localX/length*value*speed/fps;
    var incrementY = localY/length*value*speed/fps;
    velocities[j][0] += incrementX;
    velocities[j][1] += incrementY;
  }
  else if (forces[id].type === 2) { // One direction
    var incrementX = angToVersor(forces[id].rad3)[0]*value*speed/fps;
    var incrementY = angToVersor(forces[id].rad3)[1]*value*speed/fps;
    velocities[j][0] += incrementX;
    velocities[j][1] += incrementY;
  }
  else if (forces[id].type === 3) { // Vortex
    var angle = relativeAngle([localX,localY]);
    var sign = forces[id].rot;
    var forceAngle = angle + sign*Math.PI/2;
    var force = angToVersor(forceAngle);
    var incrementX = force[0];
    var incrementY = force[1];
    velocities[j][0] += incrementX;
    velocities[j][1] += incrementY;
  }
}
// ========================================
// Check force time constraints
function forceTiming(id,fps) {
  // ---Check time constraints---
  // Check delay
  var delay = forces[id].delay;
  var currentTime = frame / fps;
  if (currentTime < delay) {
    return false
  }
  // Check stop time
  var stopTime = forces[id].stopTime;
  if (currentTime > stopTime) {
    return false
  }
  // Check iterations
  var currentIteration = Math.ceil((currentTime-delay)/(interval+1));
  if (currentIteration > iterations) {
    return false
  }
  // Check interval
  // Is force in resting phase or should it be applied?
  var interval = forces[id].interval; //interval lasts 1s
  var iterations = forces[id].iterations;
  if (((currentTime-delay)-(currentIteration-1)*(interval+1))>1) {
    return false
  }
  return true
}
// ========================================
// ---Global Variables
var velocities = []; //Current speed vector of each pixel
// -----------
function simulate() {
  pixels = document.querySelectorAll('.pixel');
  position = mkArray(n,pixels.length,2); // Prepare array
  var time = setup.length; // when animation should stop
  var fps = 60;
  var frames = time * fps;
  var forcesCount = Object.keys('forces').length;

  for (var i = 0; i < frames.length; i++) {
    veocities[i] = [];
  }

  for (var i = 0; i < frames.length; i++) {
    for (var j = 0; j < pixels.length; j++) {
      // Record current position:
      var x = parseInt(pixels[j].style.left);
      var y = parseInt(pixels[j].style.bottom);
      position[i][j] = [x,y];

      for (var k = 0; k < Object.keys(forces).length; k++) {
        var forceApplies = forceTiming(id,fps);
        if (!forceApplies) return

      }
    }
  }
}
// ==========================================
function movePixel(pixel) {


}
// ==========================================
function restore() {
// Restore initial position of pixels
  var x,y;
  if (pixels!=undefined) {
    for (var i = 0; i < pixels.length; i++) {
      x = position[0][i][0];
      y = position[0][i][1];
      pixels[i].style.left = x * pW + 'px';
      pixels[i].style.bottom = y * pW + 'px';
    }
  }
}
// ==========================================
function play(dir) {
// Move all pixels of given element
// according to their saved movements.
// Forwards (dir = 1) or backwards (-1)
  for (var i = 0; i < position.length; i++) {
    for (var j = 0; j < pixels.length; j++) {
      var x, y;
      if (dir == 1) {
        x = position[i][j][0];
        y = position[i][j][1];
      }
      else if (!dir || dir == -1 ) {
        x = position[position.length - 1 - i][j][0];
        y = position[position.length - 1 - i][j][1];
      }
      setTimeout( function(x,y,j) {
        pixels[j].style.left = x*pW + 'px';
        pixels[j].style.bottom = y*pW + 'px';
      },1000/setup.speed*i,x,y,j);
    }
  }
}
// OBSOLETE
// ========================================
function explode() {
// Relocate all pixels of given element
// in specific number of random moves
// and position all taken actions for each.

// Define number of movements based on minimal
// number of them required to reach viewport edge.
  var vpSize = Math.max(window.innerHeight, window.innerWidth);
  var n = Math.floor((vpSize/2)/pW * setup.range);
restore(); //Restore pixels default positions
pixels = document.querySelectorAll('.pixel'); // All pixl elements
position = mkArray(n,pixels.length,2); // Prepare array
var dirX = [], dirY = [];
//----------------------------------------
// Define direction of movement for each pixel
// as if they would spread in a radial pattern:
// pixel to the right from center - moves to the right
// pixel below the center - moves down etc.
  for (var i = 0; i < pixels.length; i++) {
    // Orthogonal direction:
    if (x > centerX) dirX[i] = 1; //Go right
    else dirX[i] = -1;            //Go left
    if (y > centerY) dirY[i] = 1; //Go up
    else dirY[i] = -1;            //Go down
    // Exact direction
    // Offset from the system's 0,0 (or text center)
    var dX = Math.abs(centerX - x); //Offset on X
    var dY = Math.abs(centerY - y); //Offset on Y
    // What part of total offset falls on the side of X.
    // You can read it as probability of moving on X axis:
    // coeX < 0.5 - movements will be mostly vertical
    // coeX > 0.5 - movements will be mostly lateral
      coeX[i] = dX/(dX + dY);
  }
  for (var i = 0; i < n; i++) { // i Frame
    for (var j = 0; j < pixels.length; j++) { // j Pixel
      // Record current position:
      var x = parseInt(pixels[j].style.left)/pW;
      var y = parseInt(pixels[j].style.bottom)/pW;
      position[i][j] = [x,y]; //in normalized units
      // -------------------------------
      // Define new position:
        var dX = Math.abs(centerX - x);
        var dY = Math.abs(centerY - y);
        // ----Not random move----
        if (Math.random()<(1-setup.rand)) {
          if (dX/(dX + dY) < coeX[j]) {
            x = x + dirX[j];
          }
          else if (dX/(dX + dY) > coeX[j]) {
            y = y + dirY[j];
          }
          else if (dX/(dX + dY) > 0.5) {
            x = x + dirX[j];
          }
          else if (dX/(dX + dY) < 0.5) {
            y = y + dirY[j];
          }
          else if (Math.random() > 0.5) {
            x = x + dirX[j];
          }
          else {
            y = y + dirY[j];
          }
        }
        // ----Random move----
        else if (Math.random() > 0.5) { //T: random on X
          x = x + dirX[j];
        }
        else { //T: random on Y
          y = y + dirY[j];
        }
      //------------------------------------
      // Apply new position:
      pixels[j].style.left = x * pW + 'px';
      pixels[j].style.bottom = y * pW + 'px';
    }
  }
  // Restore initial position
  restore();
}
