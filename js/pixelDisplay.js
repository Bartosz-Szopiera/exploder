// ==========================================
var centerX = 0;
var centerY = 0;
var pixelWidth = 14; //px, with margin
var pW = pixelWidth; //for shortcut
var display = document.querySelector('div.display');
var batch = []; //array of coordinates
var pixels; // Array of all the pixels
var record; // Array of past movements
var coeX = [];
var coordinates = {}; // Object for all symbols coordinates
var widths = {}; // Object for all symbols widths
var readyInput = []; // List of symbols to display
var localData = {
  'settings'  : null,
  'symbols'   : null,
  'symbolsParsed' : null
}
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
// position - X,Y of force placement in local coordinates of .display
// rad1 - X,Y defining first perimeter of affected space
// rad2 - X,Y defining second perimeter of affected space
// rad3 - X,Y defining direction of simpleForce
// dir - (+1 or -1) defines direction of vortex rotation
// duration - (0 or 1) acts one time or continuously
// type - (1,2 or 3) radial force, one direction force or vortex
// radialForce - force acting radlial form it's center
// simpleForce - force acting in one direction
// vortex - force which spins around
// ========================================
var forces = {};
// ========================================
var defaultForce = {
  type1 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.5*Math.PI,
    'rad2'    : 1.5*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'dir'     : 1,
    'duration' : 0,
    'type'     : 1,
  },
  type2 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.5*Math.PI,
    'rad2'    : 1.5*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'dir'     : 1,
    'duration' : 0,
    'type'     : 2,
  },
  type3 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.5*Math.PI,
    'rad2'    : 1.5*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'dir'     : 1,
    'duration' : 0,
    'type'     : 3,
  },
};
// ========================================
// Make ready to create a new force
function addForce(target) {
  window.addEventListener('mousedown', createForce);
  target.classList.add('active');
}
// ========================================
// Create new force at clicked location.
// --Global variables--
// Index for each new force:
  var forceIndex = 0;
// Container for all currently attached handlers of
// events for force modification:
  var handlers = [];
// --Function--
function createForce() {
  var protoForce = document.querySelector('#protoForce');
  var force = protoForce.cloneNode(true);
  force.id = '';
  force.className = 'force';
  var forceWrapper = document.querySelector('#forceWrapper');
  forceWrapper.appendChild(force);
  forceIndex ++;
  force.dataset.forceIndex = forceIndex;
  force.style.display = 'flex';
  // Attach listeners to manipulate force
  var rad3Element = force.querySelector('.rad3');
  var rangeElement = force.querySelector('.range');
  var valueElement = force.querySelector('.value');
  var typeElement = force.querySelector('.type');
  // Attach listeners:
  // Control direction
  rad3Element.addEventListener('mousedown', function(){
    modifyDirection(force, true);
    var handler = function(){modifyDirection(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control area of influence
  rangeElement.addEventListener('mousedown', function(){
    modifyRange(force, true);
    var handler = function(){modifyRange(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control force value
  valueElement.addEventListener('mousedown', function(){
    modifyValue(force, true);
    var handler = function(){modifyValue(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control force type and force location
  typeElement.addEventListener('mousedown', function(){
    if(typeElement.dataset.dbclick == true) return
    // Drag to move force:
    var handler = function(){moveForce(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    // Stop dragging behavior
    window.addEventListener('mouseup', stopModifying);
    // Allow doubleclick to change type
    typeElement.addEventListener('mouseup', dbClick);
    function dbClick() {
      typeElement.dataset.dbclick = true;
      typeElement.addEventListener('mousedown', modifyType);
      setTimeout(function(element){
        element.removeEventListener('mousedown', modifyType);
        element.dataset.dbclick = false;
      }, 250, typeElement);
      typeElement.removeEventListener('mouseup', dbClick);
    }
  });
  // Get click position
  var globalX = event.clientX;
  var globalY = event.clientY;
  // Get position of .display center
  // var display = document.querySelector('.display');
  var centerX = display.offsetLeft;
  var centerY = display.offsetTop;
  // Get position of force in local system of the display
  var localX = globalX - centerX;
  var localY = globalY - centerY;
  // Position force in local system of the display
  force.style.left = localX + 'px';
  force.style.top = localY + 'px';
  // Define basic properties
  Object.defineProperty(forces, forceIndex, {
    configurable: true,
    value: defaultForce.type1
  });
  // Update position inside the object
  forces[forceIndex].position = [localX,localY];
  window.removeEventListener('mousedown', createForce);
  document.getElementById('addForce').classList.remove('active');
}
// ========================================
// Remove all window event associated with
// modifying force.
function stopModifying() {
  console.log('removing handlers');
  for (var i = 0; i < handlers.length; i++) {
    window.removeEventListener('mousemove', handlers[i]);
  }
  window.removeEventListener('mouseup', stopModifying);
  // Clear an array
  handlers = [];
}
// ========================================
// Modify existing force
// action - type of event
// start (bool) - was event just attached?
var cursorX, cursorY, cursorOldX, cursorOldY;
var refVec = [1,0]; // reference vector indicating 0' angle
// ========================================
function modifyDirection(target, start) {
  console.log('modifyDirection');
  var id = parseInt(target.dataset.forceIndex);
  if (forces[id].type != 2) return
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    // Define change in direction
    angleDelta = vectorAngle([x,y],[xOld,yOld]);
    relativeDeltaNew = relativeAngle([x,y]);
    relativeDeltaOld = relativeAngle([xOld,yOld]);
    relativeDelta = relativeDeltaOld - relativeDeltaNew;
    if (relativeDelta == angleDelta) {
      angleDelta = relativeDelta;
    }
    // Apply new direction to the force
    prop.rad3 += angleDelta;
    // APPLY CHANGE TO THE ELEMENT STYLE
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyRange(target, start) {
  console.log('modifyRange');
  var id = parseInt(target.dataset.forceIndex);
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    // Define change in direction
    angleDelta = vectorAngle([x,y],[xOld,yOld]);
    relativeDeltaNew = relativeAngle([x,y]);
    relativeDeltaOld = relativeAngle([xOld,yOld]);
    relativeDelta = relativeDeltaOld - relativeDeltaNew;
    if (relativeDelta == angleDelta) {
      angleDelta = relativeDelta;
    }
    // Rotate influence borders (rad1 rad2)
    prop.rad1 += angleDelta;
    prop.rad2 += angleDelta;
    // Define change in range (space covered)(rad1-rad2 cone)
    var delta = vectorLength([x,y]) - oldLength;
    prop.rad1 -= (2*Math.PI)/50*delta; //?????
    prop.rad1 += (2*Math.PI)/50*delta; //?????
    // APPLY CHANGE TO THE ELEMENT STYLE
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyValue(target, start) {
  console.log('modifyValue');
  var id = parseInt(target.dataset.forceIndex);
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    var delta = vectorLength([x,y]) - oldLength;
    prop.value += delta/10;
    // APPLY CHANGE TO THE ELEMENT STYLE
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyType() {
  console.log('modifyType');
  this.removeEventListener('mousedown', modifyType);
  this.dataset.dbclick = false;
  var force = this.parentNode.parentNode;
  var id = parseInt(force.dataset.forceIndex);
  // Record current position
  // oldPosition = [forces[id].position];
  oldPosition = forces[id].position;
  // Change type of emitted force
  var type = forces[id].type;
  type = type == 3 ? 1 : type + 1;
  // Remove old force from 'forces' object
  delete forces[id];
  // Insert new force of given type
  Object.defineProperty(forces, id, {
    configurable: true,
    value: defaultForce['type' + type]
  });
  var typeElement = force.querySelector('.type');
  typeElement.dataset.forceType = type;
  // Restore force position
  forces[id].position = oldPosition;

  // Reload graphic of the force to depict changed values
  // updateForceGraphic(id, 'all');
}
// ========================================
function removeForce() {
  var forceWrapper = document.selectElementById('forceWrapper');
  forceWrapper.removeChild(this);
}
function selectToDelete() {
  var forces = document.querySelectorAll('forces');
  if (this.classList.contains('pressed')) {
    for (var i = 0; i < forces.length; i++) {
      forces[i].removeEventListener('click', removeForce);
    }
  }
  else {
    this.classList.add('pressed');
    for (var i = 0; i < forces.length; i++) {
      forces[i].addEventListener('click', removeForce);
    }
  }
}
// ========================================
function moveForce(target) {
  // console.log('moveForce');
  // console.log(target);
  var force = target;
  var forceIndex = force.dataset.forceIndex;
  // Get click position
  var globalX = event.clientX;
  var globalY = event.clientY;
  // Get position of .display center
  // var display = document.querySelector('.display');
  var centerX = display.offsetLeft;
  var centerY = display.offsetTop;
  // Get position of force in local system of the display
  var localX = globalX - centerX;
  var localY = globalY - centerY;
  // Position force in local system of the display
  force.style.left = localX + 'px';
  force.style.top = localY + 'px';
  forces[forceIndex].position = [localX,localY];
  // Disable option to double-click to change type
  var typeElement = target.querySelector('.type');
  typeElement.removeEventListener('click', modifyType);
}
// ========================================
function pointsDistance(p1,p2) {
  var distance = vectorLength([p1[0]-p2[0], p1[1]-p2[1]]);
  return distance
}
// ========================================
function vectorLength(point) {
  var length = Math.sqrt(point[0]*point[0] + point[1]*point[1]);
  return length;
}
// ========================================
// Angle between vectors 1 and 2
function vectorAngle(v1,v2) {
  var dotProd = v1[0]*v2[0] + v1[1]*v2[1];
  var v1Len = vectorLength(v1);
  var v2Len = vectorLength(v2);
  var angle = Math.acos(dotProd/(v1Len*v2Len)); //radians
  return angle
}
// ========================================
// Measure angle between vector and vector [1,0]
// assuming that angles are measured always from
// [1,0] and clockwise
function relativeAngle(v) {
  var dotProd = v[0];
  var vLen = vectorLength(v);
  var angle = Math.acos(dotProd/v1Len); //radians
  angle = v[1] > 0 ? angle : (Math.PI*2 - angle);
  return angle
}
// ========================================
// Return coordinates of versor which creates
// with versor [1,0] given angle
function angToVector(angle) {
  var x = Math.cos(angle);
  // if (angle < Math.PI) {
  //   angle = Math.abs(angle);
  // }
  var y = Math.sqrt(1-x*x);
  if (angle > Math.PI) {
    y = -y;
  }
  return [x,y]
}
// ========================================
function sumVector(v1,v2) {
  return [v1[0]+v2[0],v1[1]+v2[1]]
}
// ========================================
// pix - X,Y coordinates of pixel in global system
function applyForce(pix, force) {
  var center = force.center;
  var val = force.value;
  var rad1 = force.rad1;
  var rad2 = force.rad2;
  var rad3 = force.rad3;
  var dir = force.dir;
  var dur = force.duration;
  // Transform 'pix' to local system
  var localPix = [pix[0] - center[0], pix[1] - center[1]];
  // Check if pixel is in the area of influence
  // of the force
  var localPixLen = vectorLength(localPix);
  var rad1Len = vectorLength(rad1);
  var rad2Len = vectorLength(rad2);
  var dotProd1 = pix[0]*rad1[0]+pix[1]*rad1[1];
  var angle1 = Math.acos(dotProd/(rad1Len*rad2Len)); //radians
  var dotProd2 = pix[0]*rad2[0]+pix[1]*rad2[1];
  var angle2 = Math.acos(dotProd/(rad1Len*rad2Len)); //radians
  if (angle1 < angle2) break;

  // Try to describe forces so that there will be in one function.

  // Get current pixel acceleration: value + direction
  // Modify acceleration with effects of this force
  // Save modified acceleration (value and direction (vector))
}
// ========================================
function simulate() {
  // How many frames to simulate
    // What is desired speed
    // What is desired fps
    // What is desired animation time
  var speed = setup.speed; // modify interval between frames
  var fps = setup.fps; // how many frames per secund will be captured
  var time = setup.length; // when animation should stop

  for (var i = 0; i < frames.length; i++) { //Each frame

    for (var j = 0; j < pixels.length; j++) { //Each pixel
      // Record current position:
      var x = parseInt(pixels[j].style.left);
      var y = parseInt(pixels[j].style.bottom);
      record[i][j] = [x,y];

      for (var k = 0; k < Object.keys(forces).length; k++) { //Each force
        var index = Object.keys(forces)[k];
        var properties = forces[index];
        applyForce(pixels[j], properties);
      }
      movePixel(pixels[j]);
    }
  }
}
// ==========================================
function restore() {
// Restore initial position of pixels
  var x,y;
  if (pixels!=undefined) {
    for (var i = 0; i < pixels.length; i++) {
      x = record[0][i][0];
      y = record[0][i][1];
      pixels[i].style.left = x * pW + 'px';
      pixels[i].style.bottom = y * pW + 'px';
    }
  }
}
// ==========================================
function play(dir) {
// Move all pixels of given element
// according to their recorded movement
// patterns forwards (dir = 1) or backwards (-1)
  for (var i = 0; i < record.length; i++) {
    for (var j = 0; j < pixels.length; j++) {
      var x, y;
      if (dir == 1) {
        x = record[i][j][0];
        y = record[i][j][1];
      }
      else if (!dir || dir == -1 ) {
        x = record[record.length - 1 - i][j][0];
        y = record[record.length - 1 - i][j][1];
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
// and record all taken actions for each.

// Define number of movements based on minimal
// number of them required to reach viewport edge.
  var vpSize = Math.max(window.innerHeight, window.innerWidth);
  var n = Math.floor((vpSize/2)/pW * setup.range);
restore(); //Restore pixels default positions
pixels = document.querySelectorAll('.pixel'); // All pixl elements
record = mkArray(n,pixels.length,2); // Prepare array
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
      record[i][j] = [x,y]; //in normalized units
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
