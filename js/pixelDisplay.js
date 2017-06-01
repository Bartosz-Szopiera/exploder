//------------------------------
var centerX = 0;
var centerY = 0;
var pixelWidth = 13; //px, with margin
var pW = pixelWidth; //for shortcut
var display = document.querySelector('div.display');
var batch = []; //array of coordinates
var pixels; // Array of all the pixels
var record; // Array of past movements
var coeX = [];
//-------------------------------------
// SETTINGS
var keys = ['scale','rand','range','density','speed']
var setup = {
  'scale'   : 1, //
  'rand'    : 0.15, // Probability of random movements
  'range'   : 0.6, // How much moves pixels make
  'density' : 1, // Pixels number multiplier
  'speed'   : 30 // Pixel movements per second
}
// ----------------------------------------
// Example symbols
var letterT = {
  'coords' : [[1,0],[1,1],[1,2],[1,3],[0,3],[2,3]],
  'width' : 3
}
var letterA = {
  'coords' : [[0,0],[0,1],[0,2],[0,3],[1,1],[1,3],[2,0],[2,1],[2,2],[2,3]],
  'width' : 3
}
var space = {
  'coords' : [],
  'width' : 0.5
}
// ----------------------------------------
// list of symbols to query for symbol index
var symbolIndex = 'AT '; // <-- DATABASE
// list of symbols to query for the data
var symbols = [letterA, letterT, space]; // <-- DATABASE
// Text to create
var text = "A A A ATA  A" // <-- INPUT
// ----------------------------------------
function createBatch(text) {
// Compile all the letters into one
// set of coordinates and calculate
// length of the text
  var textLen = 0;
  // Iterate through each letter
  for (var i = 0; i < text.length; i++) {
    // Index of 'i' letter in the array of all
    // known symbols
    var id = symbolIndex.indexOf(text.charAt(i));
    // Iterate through pixels
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
// ----------------------------------------
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
// ----------------------------------------
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
// ----------------------------------------
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
// ----------------------------------------
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
    if (c && c > 1) {
      for (var j = 0; j < b; j++) {
        array[i][j] = [];
      }
    }
  }
  return array;
}
// ----------------------------------------
function explode() {
// Relocate all pixels of given element
// in specific number of random moves
// and record all taken actions for each.

// Define number of movements
var vpSize = Math.max(window.innerHeight, window.innerWidth);
var n = Math.floor((vpSize/2)/pW * setup.range)
// Restore default positions of pixels
restore();
pixels = document.querySelectorAll('.pixel');
record = mkArray(n,pixels.length,2);
var dirX = [], dirY = [];
  for (var i = 0; i < n; i++) {
    // Record n-th frame
    for (var j = 0; j < pixels.length; j++) {
      // Record current position:
      var x = parseInt(pixels[j].style.left)/pW;
      var y = parseInt(pixels[j].style.bottom)/pW;
      record[i][j] = [x,y]; //in normalized units
      // Define average direction:
      if (i == 0) {
        // Orthogonal direction:
        if (x > centerX) dirX[j] = 1;
        else dirX[j] = -1;
        if (y > centerY) dirY[j] = 1;
        else dirY[j] = -1;
        // Exact direction:
        var dX = Math.abs(centerX - x);
        var dY = Math.abs(centerY - y);
        // Coeafficient telling how much given
        // pixel is eccentric on x axis relative
        // to its total eccentricity
        coeX[j] = dX/(dX + dY);
      }
      // Define new position:
      var dX = Math.abs(centerX - x);
      var dY = Math.abs(centerY - y);

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
      else if (Math.random() > 0.5) {
        x = x + dirX[j];
      }
      else {
        y = y + dirY[j];
      }
      // Apply new position:
      pixels[j].style.left = x * pW + 'px';
      pixels[j].style.bottom = y * pW + 'px';
    }
  }
  // Restore initial position
  restore();
}
// ----------------------------------------
function restore() {
// Restore initial position of text pixels
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
// ----------------------------------------
function play(dir) {
// Move all pixels of given element
// according to their recorder movement
// patterns
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
// ----------------------------------------
function transform(el) {
// Transform element by:
// *increasing its number of pixels and
//  decreasing their size
// *scaling whole element up or down relative
//  to its origin
}

function visualStyle() {

}
