//------------------------------
//CREATE PIXELS GRID
// var grid = document.querySelector('.grid');
// var rows; //number of grid rows
// var columns; //number of grid columns
// var size; //number of pixels on the grid
var centerX;
var centerY;
// var pixelWidth = 26; //px, with margin
var pixelWidth = 13; //px, with margin
var pW = pixelWidth; //for shortcut
var display = document.querySelector('div.display');
var batch = []; //array of coordinates
var textLen = 0; //length of the text
var pixels; // Array of all the pixels
var record; // Array of past movements
var coeX = [];
//-------------------------------------
function createGrid() { //outdated name
  var displayWidth = display.offsetWidth;
  var displayHeight = display.offsetHeight;
  rows = Math.floor(displayHeight/pixelWidth);
  columns = Math.floor(displayWidth/pixelWidth);
  centerX = Math.floor(columns/2);
  centerY = Math.floor(rows/2);
  centerX = 0;
  centerY = 0;
  // Adjust the size of display
  // display.style.width = columns * pixelWidth + 'px';
  // display.style.height = rows * pixelWidth + 'px';
  // size =  rows * columns;
  // Create pixels
  // for (var i = 0; i < size; i++) {
    // var cell = document.createElement('div');
    // cell.className = "cell";
    // grid.appendChild(cell);
    // cell.dataset.index = i;
  // }
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
  'width' : 1
}
// ----------------------------------------
// list of symbols to query for symbol index
var symbolIndex = 'AT '; // <-- DATABASE
// list of symbols to query for the data
var symbols = [letterA, letterT, space]; // <-- DATABASE
// Text to create
var text = "AAAAAAA" // <-- INPUT
// ----------------------------------------
function aggregate() {
// Compile all the letters into one
// set of coordinates and calculate
// length of the text
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
function textHeight(el) {
// Go through 'y' coordinates and find
// and compare their extreme values
  var maxY = 0, minY = 0;
  for (var i = 0; i < el.length; i++) {
    var y = el[i][1];
    if (i == 0) {maxY = y; minY = y}
    if (maxY < y) maxY = y
    if (minY > y) minY = y
  }
  var height;
  if (minY >= 0) height = maxY - minY
  else height = Math.abs(minY) + maxY
  return height + 1; //y = 0 gives 1 in height
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
// Create multidimensional array
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
function explode(n) {
// Relocate all pixels of given element
// in specific number of random moves
// and record all taken actions for each
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
        // Coeafficient telling how much
        // pixel ic eccentric on x axis relative
        // to total eccentricity
        coeX[j] = dX/(dX + dY);
      }
      // Define new position:
      var dX = Math.abs(centerX - x);
      var dY = Math.abs(centerY - y);

      if (Math.random()<0.85) {
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
  for (var i = 0; i < pixels.length; i++) {
    x = record[0][i][0];
    y = record[0][i][1];
    pixels[i].style.left = x * pW + 'px';
    pixels[i].style.bottom = y * pW + 'px';
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
      if (!dir || dir == 1 ) {
        x = record[record.length - 1 - i][j][0];
        y = record[record.length - 1 - i][j][1];
      }
      else if (dir == -1) {
        x = record[i][j][0];
        y = record[i][j][1];
      }
      setTimeout( function(x,y,j) {
        pixels[j].style.left = x*pW + 'px';
        pixels[j].style.bottom = y*pW + 'px';
      },10*i,x,y,j);
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
