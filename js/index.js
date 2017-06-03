// =========================================
// Routines providing general functionality
// =========================================
buildGrid(500,200);
// createBatch(inputText);
// letters currently have always 4 pixels in height
// So 2 is half on the height of the text
// layout(batch, -textLen/2,-textHeight(batch)/2);
// layout(batch, -textWidth(batch)/2,-textHeight(batch)/2);
isLogged();
// ========================================
// Show or hide tabs acoording to which one
// was clicked
function showTab(labelName) {
  // Panels
  var panels = document.querySelectorAll('.panels .tab');
  // Labels
  var labels = document.querySelectorAll('.label');
  // Labels container
  var labelsSection = document.querySelector('.labels');
  for (var i = 0; i < panels.length; i++) {
    // Panel that was clicked
    if (panels[i].classList.contains(labelName)) {
      // Handle labels container
        // Panel was active
        if (labels[i].classList.contains('active')) {
          // Indicate that no panel is now active (for css)
          labelsSection.classList.remove('active');
        }
        // Panel wasn't active
        else {
          // Indicate that some panel is now active
          labelsSection.classList.add('active');
        }
      // Toggle this panel state (panel + it's label)
      panels[i].classList.toggle('hidden');
      labels[i].classList.toggle('active');
    }
    // Other panels
    else {
      // Hide tabs of labels that were not clicked
      panels[i].classList.add('hidden');
      labels[i].classList.remove('active');
    }
  }
  adjustDBWindow();
  showGrid();
}
// ========================================
// Adjust height of the database window
function adjustDBWindow() {
  var main = document.querySelector('main');
  var panels = document.querySelector('div.panels');
  var mainHeight = parseInt(getComputedStyle(main).height);
  var height = mainHeight - panels.offsetHeight;
  var databaseWindow = document.querySelector('div.database');
  databaseWindow.style.height = height - 1 + 'px';
}
// ========================================
// Show the window with settings database
function showDatabase() {
  var el = document.querySelector('div.database');
  el.classList.toggle('hidden');
  adjustDBWindow();
}
// ========================================
// Load settings <input> values to the 'get'
// object for js access
function takeInput(target) {
  var property = target.name;
  setup[property] = parseFloat(target.value);
}
// ========================================
// Change form 'action' url appropriately to the
// submit button clicked
function userForm(target) {
  var form = document.querySelector('#userForm');
  if (target.name == "login") {
    form.action = "javascript:login()";
  }
  else if (target.name == "register") {
    form.action = "javascript:register()";
  }
}
// ========================================
// Hide user form if server returned session
// cookie - user is logged-in
function toggleUserForm(response) {
  var user = document.querySelector('.userProfile');
  var userName = document.querySelector('#userName');
  if (document.cookie.search('PHPSESSID') != -1) {
    user.classList.add('logged');
    userName.innerHTML = response.userName;
    document.querySelector('#userForm').reset();
  }
  else {
    user.classList.remove('logged');
    userName.innerHTML = 'Nameless';
  }
}
// ========================================
// Load downloaded settings to the table
var settings;
function updateTable(response) {
  var mainTable = document.querySelector('#mainTable tbody');
  var userTable = document.querySelector('#userTable tbody');

  if (typeof(response.data) != 'undefined') {
    settings = response.data; //array
    // Remove previously inserted rows
    var clones = mainTable.querySelectorAll('.clone');
    for (var i = 0; i < clones.length; i++) {
      mainTable.removeChild(clones[i]);
    }
    var row = document.getElementById('row');
    row.removeAttribute('id');
    // Insert rows
    for (var i = 0; i < settings.length; i++) {
      var clone = row.cloneNode(true);
      clone.classList.add('clone');
      mainTable.appendChild(clone);
      clone.children[0].innerHTML = i;
      for (var j = 1; j < clone.children.length; j++) {
        clone.children[j].innerHTML = settings[i][j-1];
      }
    }
    row.id = 'row';
  }
  // Remove rows form the user table
  var userTableClones = userTable.querySelectorAll('.clone');
  for (var i = 0; i < userTableClones.length; i++) {
    userTable.removeChild(userTableClones[i]);
  }
  var clones = mainTable.querySelectorAll('.clone');
  var user_name = document.getElementById('userName').innerHTML;
  // Insert rows to the user table
  for (var i = 0; i < clones.length; i++) {
    if (user_name == clones[i].children[1].innerHTML) {
      var clone = clones[i].cloneNode(true);
      userTable.appendChild(clone);
      clone.removeAttribute('onmouseenter');
      clone.removeAttribute('onmouseleave');
    }
  }
}
// ========================================
// Load explosion settings from 'settings' variable
// to the settingsForm based on user selection
// from the Settings Database table.
var setupBuffer = []; //temporary container for settings
function loadFromTable(target) {
  var settingsForm = document.querySelector('div.settings.tab');
  var inputs = settingsForm.querySelectorAll('input');
  if (event.type == 'mouseenter' || event.type == 'click') {
    // Save settings to the buffer
    for (var i = 0; i < inputs.length; i++) {
      setupBuffer[i] = setup[keys[i]];
    }
  }
  if (event.type == 'mouseenter') {
    // Load settings from table to the form inputs
    var index = parseInt(target.children[0].innerHTML);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = parseFloat(settings[index][i + 2]);
    }
  }
  if (event.type == 'click') {
    // Load settings from table to the form inputs,
    // setup object and buffer
    var index = parseInt(target.children[0].innerHTML);
    for (var i = 0; i < inputs.length; i++) {
      var value = parseFloat(settings[index][i + 2])
      inputs[i].value = value;
      setup[keys[i]] = value;
      setupBuffer[i] = value;
    }
  }
  if (event.type == 'mouseleave') {
    // load settings from the buffer
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = setupBuffer[i];
    }
  }
}
// ========================================
function removePixels() {
// Remove all pixels from the display
// (They are easy to recover from 'batch')
  var pixels = document.querySelectorAll('.pixel');
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].remove();
  }
}
// ========================================
function hidePixels() {
  var pixels = document.querySelectorAll('.pixel');
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.remove('hidden');
  }
}
// ========================================
function showPixels() {
  var pixels = document.querySelectorAll('.pixel');
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.add('hidden');
  }
}
// ========================================
// Display grid for creating and editing symbols
function buildGrid(width,height) {
  var grid = document.querySelector('.grid');
  var cellsWrapper = document.querySelector('.cellsWrapper');
  var cell = document.querySelector('.cell');
  var base = document.querySelector('.base');
  var cellWidth = pixelWidth;
  base.style.height = pixelWidth + 'px';
  var cellsInRow = Math.floor(width/cellWidth);
  var cellsInColumn = Math.floor(height/cellWidth);
  base.style.top = (cellsInColumn - 2) * pixelWidth + 'px';
  cellsWrapper.style.maxWidth = cellsInRow * cellWidth + 'px';
  cellsWrapper.style.maxHeight = cellsInColumn * cellWidth + 'px';
  for (var i = 1; i < cellsInRow*cellsInColumn; i++) {
    cellsWrapper.appendChild(cell.cloneNode());
  }
}
function showGrid() {
  var grid = document.querySelector('.grid');
  var editor = document.querySelector('.label.editor');
  if (editor.classList.contains('active')) {
    hidePixels();
    grid.classList.remove('hidden');
  }
  else {
    showPixels();
    grid.classList.add('hidden');
  }
}
// ========================================
function selectCell(target) {
  target.classList.toggle('active');
}
// ========================================
// Below three function serve the action of
// sliding '.base'-level slider
var mousePositionY;
var realDelta = 0;
function startDrag(evt) {
  var base = document.querySelector('.base');
  base.classList.add('active');
  window.addEventListener('mousemove', dragBase);
  window.addEventListener('mouseup', stopDrag);
  mousePositionY = evt.clientY;
}
function stopDrag() {
  var base = document.querySelector('.base');
  base.classList.remove('active');
  window.removeEventListener('mousemove', dragBase);
}
function dragBase(evt) {
  var base = document.querySelector('.base');
  // 'realDelta = realDelta +..' - increase value with
  // each event instance until amounts for the whole pixelWidth
  realDelta = realDelta + mousePositionY - evt.clientY;
  // '.../ pixelWidth) * p.W. ' - quantify move to thole cell
  var delta = Math.round(realDelta / pixelWidth) * pixelWidth;
  baseTop = parseInt(getComputedStyle(base).top);
  var gridHeight = document.querySelector('.grid').offsetHeight - 2;
  // Math.min/max - restrict location to the grid height
  newTop = Math.min(Math.max(baseTop - delta, 0), gridHeight - pixelWidth);
  base.style.top = newTop + 'px';
  realDelta = realDelta - delta; // subtract any whole move
  mousePositionY = evt.clientY;
  console.log(base.offsetTop);
}
// ========================================
var newSymbolX = [];
var newSymbolY = [];
function loadFromEditor() {
  var activeCells = document.querySelectorAll('.cell.active');
  var base = document.querySelector('.base');
  var grid = document.querySelector('.grid');
  var gridHeight = grid.offsetHeight - 2; // 2 - grid border
  var baseY = Math.abs(base.offsetTop + pixelWidth - gridHeight);
  for (var i = 0; i < activeCells.length; i++) {
    var cellY = activeCells[i].offsetTop - 1; // 1 - Cell margin
    newSymbolY[i] = (cellY - baseY)/pixelWidth;
    var cellX = (activeCells[i].offsetLeft - 1)/pixelWidth;
    newSymbolX[i] = cellX;
  }
  // Normalize X coordinates
  var cacheX = [];
  cacheX.push.apply(cacheX, newSymbolX);
  minX = cacheX.sort(function(a,b){return a-b;})[0];
  for (var i = 0; i < newSymbolX.length; i++) {
    newSymbolX[i] -= minX;
  }
}
