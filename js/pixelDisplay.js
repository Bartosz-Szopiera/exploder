// ==========================================
var centerX = 0;
var centerY = 0;
var pixelWidth = 13; //px, with margin
var pW = pixelWidth; //for shortcut
var display = document.querySelector('div.display');
var batch = []; //array of coordinates
var pixels; // Array of all the pixels
var record; // Array of past movements
var coeX = [];
var coordinates = {}; // Object for all symbols coordinates
var widths = {}; // Object for all symbols widths
var readyInput = []; // List of symbols to display
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
// Convert server response to more convenient format
// and aggregate it in appropariate variables.
function adaptServerData(data) {
  for (var i = 0; i < data.length; i + 2) {
    var coords = [];
    var symbolCode = data[i][0];
    // Insert 'X' coordinates
    for (var j = 1; j < data[i].length; j++) {
      coords[j] = [];
      coords[j][0] = data[i][j];
    }
    // Insert 'Y' coordinates
    for (var j = 1; j < data[i+1].length; j++) {
      coords[j] = [];
      coords[j][1] = data[i+1][j];
    }
    // Define symbol width
    var width = textWidth(coords)
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
function evaluateInputText(text) {
  readyInput = [];
  for (var i = 0; i < text.length; i++) {
    var symbol = text[i];
    // '<' indicate code for special symbol if
    // unescaped with '<'
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
      readyInput[i] = code;
      i = i + code.length + 1; //skip next few symbols
    }
    else if (true || fail) { //Regular symbol case
      var index = dictionary.indexOf(symbol);
      readyInput[i] = symbol;
    }
    if (index == -1) { //Invalid input case
      var msg = (code == 'undefined' ? symbol : code);
      return console.log('Unrecognized symbol/code: '+ msg +'.');
    }
  }
}
// ==========================================
// Example Data and input
var dictionary = ['A','T',' ','special'];
var coordinates = {
  'T' : [[1,0],[1,1],[1,2],[1,3],[0,3],[2,3]],
  'A' : [[0,0],[0,1],[0,2],[0,3],[1,1],[1,3],[2,0],[2,1],[2,2],[2,3]],
  ' ' : [],
}
var widths = {
  'T' : 3,
  'A' : 3,
  ' ' : 0.5
}
// ----------------------------------------
// Example text to create
var inputText = "A A A ATA  A";
// ----------------------------------------
// Compile all the letters into one
// set of coordinates and calculate
// length of the text
function createBatch(text) {
  var textLen = 0;
  // Iterate through each symbol
  for (var i = 0; i < text.length; i++) {
    // Index of 'i' letter in the array of all
    // known symbols
    var id = symbolIndex.indexOf(text.charAt(i));
    // Iterate through pixels of current symbol
    for (var k = 0; k < symbols[id].coords.length; k++) {
      var coords = []; //temporary container
      var x = symbols[id].coords[k][0];
      var y = symbols[id].coords[k][1];
      // save coords and bump-up x by the width
      // of the previous symbols
      coords.push(x + textLen, y);
      // push coordinate points to aggregate array
      batch.push(coords);
    }
    textLen += symbols[id].width;
  }
}
// ==========================================
function textHeight(array) {
// Go through 'y' coordinates and find
// and compare their extreme values
  var maxY, minY;
  for (var i = 0; i < array.length; i++) {
    var y = array[i][1]; //First pixel, second coordinate
    if (i == 0) {maxY = y; minY = y}
    if (maxY < y) maxY = y
    if (minY > y) minY = y
  }
  var height = maxY - minY;
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
// Create pixels for given element according
// to the batch and move them all to
// proper location defined in global coordinates.
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
// It makes easier process fo working with multidimensional
// arrays by constructing whole array beforehand.
// It is required as it is not possible to create arrays
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
// ==========================================
function transform(el) {
// Transform element by:
// *increasing its number of pixels and
//  decreasing their size
// *scaling whole element up or down relative
//  to its origin
}

function visualStyle() {

}
