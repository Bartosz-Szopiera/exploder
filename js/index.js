// =========================================
// Routines providing general functionality
// =========================================
buildGrid(400,200);
addListeners();
isLogged();
panelsObserver();
windowListeners();
// ========================================
// Show or hide tabs acoording to which one
// was clicked
// function showTab(labelName) {
function showTab(el) {
  if (this != window) el = this;
  el.removeEventListener('click',showTab);
  el.addEventListener('click',tabListener);
  var labelName = el.classList.item(1);
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
  // ---Hide or show side panels---
  var settingsDbTab = document.querySelector('.settings.database');
  var forceSettings = document.querySelector('.settings.forces')
  if (!labels[0].classList.contains('active')) {
    settingsDbTab.classList.add('tabHidden');
    forceSettings.classList.add('tabHidden');
  }
  else {
    settingsDbTab.classList.remove('tabHidden');
    forceSettings.classList.remove('tabHidden');
  }
  var symbolsDbTab = document.querySelector('.symbols.database');
  if (!labels[1].classList.contains('active')) {
    symbolsDbTab.classList.add('tabHidden');
  }
  else {
    symbolsDbTab.classList.remove('tabHidden');
  }
  //-------------------------
  adjustDBWindow();
  showGrid();
  hideForces();
}
function tabListener() {
  if (this.classList.contains('active')){
    this.removeEventListener('click',tabListener);
    this.addEventListener('click',showTab);
    var el = this;
    setTimeout(function(el){
      el.removeEventListener('click',showTab);
      el.addEventListener('click',tabListener);
    },250,el);
  }
  else {
    showTab(this);
  }
}
// ========================================
// Adjust height of the symbols and settings table window
function adjustDBWindow() {
  var main = document.querySelector('main');
  var panels = document.querySelector('div.panels');
  var mainHeight = parseInt(getComputedStyle(main).height);
  var height = mainHeight - panels.offsetHeight;
  var databaseWindow = document.querySelectorAll('div.database');
  // Height of settings database window
  databaseWindow[0].style.height = height - 1 + 'px';
  // Height of symbols database window
  databaseWindow[1].style.height = height - 1 + 'px';
}
// ========================================
// Show the window with settings database
function showDatabase(target) {
  var el = document.querySelector('div.' + target + '.database');
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
function updateTable(response) {
  if (typeof(response.data) == 'undefined') return;
  var subject = response.subject; //'settings'/'symbols'
  var mainTable = document.querySelector('.' + subject +' .mainTable tbody');
  var userTable = document.querySelector('.' + subject +' .userTable tbody');
  if (subject === 'settings') {
    localData.settings = response.data.settings;
    localData.forces = response.data.forces;
  }
  else {
    localData[subject] = response.data; //Store as local data
  }
  // Remove previously inserted rows
  var clones = mainTable.querySelectorAll('.clone');
  for (var i = 0; i < clones.length; i++) {
    mainTable.removeChild(clones[i]);
  }
  var row = document.querySelector('.' + subject + ' .row.prototype');
  row.classList.remove('prototype');
  // Insert rows to the mainTable

  var shift = subject === 'settings' ? 0 : -1;

  for (var i = 0; i < localData[subject].length; i++) {
    var clone = row.cloneNode(true);
    clone.classList.add('clone');
    mainTable.appendChild(clone);
    clone.children[0].innerHTML = i;
    // Populate 'i' row starting from second column (j=1)
    for (var j = 1; j < clone.children.length; j++) {
      clone.children[j].innerHTML = localData[subject][i][j + shift];
    }
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
  row.classList.add('prototype');
}
// ========================================
// Load explosion settings from 'settings' variable
// to the settingsForm based on user selection
// from the Settings Database table.
var setupBuffer = []; //temporary container for settings
var forcesBuffer = [];
function loadSettings(target) {
  var settings = localData.settings;
  var settingsForm = document.querySelector('.settingsForm.sliders');
  var inputs = settingsForm.querySelectorAll('input');
  var forceWrapper = document.getElementById('forceWrapper');
  if (event.type === 'mouseenter' || event.type == 'click') {
    // Save settings to the buffer
    for (var i = 0; i < inputs.length; i++) {
      setupBuffer[i] = setup[keys[i]];
    }
  }
  if (event.type === 'mouseenter') {
    // Load settings from table to the form inputs
    var index = parseInt(target.children[0].innerHTML);
    for (var i = 0; i < inputs.length; i++) {
      // inputs[i].value = parseFloat(settings[index][i + 2]);
      inputs[i].value = parseFloat(settings[index][i + 3]);
    }
    // Now get adequate forces settings
    var id = settings[index][0];
    // Hide forces
    for (var i = 0; i < forceWrapper.children.length; i++) {
      forceWrapper.children[i].classList.add('hidden');
    }
    // Search for forces with matching id
    for (var i = 0; i < localData.forces.length; i++) {
      if (localData.forces[i][0] === id) {
        // Draw temporary forces
          // Remove (slice) column with id
          var forceSettings = localData.forces[i].slice(1);
        createForce('', forceSettings);
      }
    }
  }
  if (event.type === 'click') {
    console.log('click!');
    // Load settings from table to the form inputs,
    // setup object and buffer
    var index = parseInt(target.children[0].innerHTML);
    for (var i = 0; i < inputs.length; i++) {
      // var value = parseFloat(settings[index][i + 2]);
      var value = parseFloat(settings[index][i + 3]);
      inputs[i].value = value;
      setup[keys[i]] = value;
      setupBuffer[i] = value;
    }
    var currentSettings = document.querySelector('#currentSettings');
    currentSettings.value = target.children[2].innerHTML;
    var settingsName = document.querySelector('#settingsName');
    settingsName.value = target.children[2].innerHTML;
    // Remove hidden forces and 'untemporary' temporary
    for (var i = 0; i < forceWrapper.children.length; i++) {
      var force = forceWrapper.children[i];
      if (force.classList.contains('hidden')) {
        var id = force.dataset.forceIndex;
        removeForce('',id,force);
      }
      else {
        force.classList.remove('temporary');
      }
    }
  }
  if (event.type === 'mouseleave') {
    // load settings from the buffer
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = setupBuffer[i];
    }
    // Remove temporary forces and show actual ones
    for (var i = 0; i < forceWrapper.children.length; i++) {
      // !!!Elements are being deleted, list length variable!!!
      console.log("i:" + i);
      var force = forceWrapper.children[i];
      if (force.classList.contains('hidden')) {
        force.classList.remove('hidden');
      }
      else if (force.classList.contains('temporary')) {
        console.log('trying to remove, i: ' + i);
        var id = force.dataset.forceIndex;
        removeForce('',id,force);
        i --;
      }
    }
  }
}
// ========================================
// Load symbol to editor grid from the table
function loadSymbol(target) {
  resetEditor();
  var symbolCode = target.children[2].innerHTML;
  var coords = coordinates[symbolCode];
  var symbolWidth = widths[symbolCode];
  var symbolHeight = textHeight(coords);
  // now find cells based on the coordinates.. gl&hf
  var cells = document.querySelectorAll('.cell');
  var grid = document.querySelector('.grid');
  var gridWidth = grid.offsetWidth;
  // var gridHeight = grid.offsetHeight - 2; // 2 - borders
  var gridHeight = parseInt(getComputedStyle(grid).height);
  var rows = Math.round(gridHeight/pixelWidth);
  var columns = Math.round(gridWidth/pixelWidth);
  // Grid is built out of the rows of cells which indices
  // rize from left to right and from bottom to the top row.
  // First cell bottom-most row(0): i = 0;
  // First cell top-most row(n): i = (n-1) * columns
  // zeroX + zeroY = cell that corresponds with
  // (0, minY) coordinates of symbol (minY - lowest pixel and
  // not more that 0).
  var zeroX = Math.round((columns - symbolWidth)/2);
  var zeroY = Math.round((rows - symbolHeight)/2)*columns;
  // Adjust position of symbols with negative 'y' coordinates
  var delta = overBaseTextHeight(coords) - symbolHeight;
  if ( delta < 0) zeroY -= delta * columns;
  // to go x+1 - add 1
  // to go y+1 - add 'columns'
  for (var i = 0; i < coords.length; i++) {
    var j = coords[i][0] + zeroX + coords[i][1]*columns + zeroY;
    cells[j].classList.add('active');
  }

  // Adjust base level indicator
  base = document.querySelector('.base');
  baseTop = gridHeight - (cells[zeroY].offsetTop - 1) - pixelWidth; // 1 - margin
  base.style.top = baseTop + 'px';

  // Populate input fields with the code for the loaded symbol
  currentSymbolField = document.querySelector('#currentSymbol');
  currentSymbolField.value = symbolCode;
  symbolCodeField = document.querySelector('#symbolCode');
  symbolCodeField.value = symbolCode;
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
// It's used to hide pixels from display
// when entering Symbols Editor
function hidePixels() {
  var pixels = document.querySelectorAll('.pixel');
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.add('hidden');
  }
  var forceWrapper = document.querySelector('#forceWrapper');
  forceWrapper.style.display = 'none';
}
// ========================================
function showPixels() {
  var pixels = document.querySelectorAll('.pixel');
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.remove('hidden');
  }
  var forceWrapper = document.querySelector('#forceWrapper');
  forceWrapper.style.display = 'unset';
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
  // '.../ pixelWidth) * p.W. ' - quantify move to whole cell
  var delta = Math.round(realDelta / pixelWidth) * pixelWidth;
  baseTop = parseInt(getComputedStyle(base).top);
  var gridHeight = document.querySelector('.grid').offsetHeight - 2;
  // Math.min/max - restrict location to the grid height
  newTop = Math.min(Math.max(baseTop - delta, 0), gridHeight - pixelWidth);
  base.style.top = newTop + 'px';
  realDelta = realDelta - delta; // subtract any whole move
  mousePositionY = evt.clientY;
}
// ========================================
// Prepare sets of X and Y coordinates describing
// pixels of the new symbol.
// Coordinates are derviced from postion of .active .cell's
// relative to the .grid element (offsetTop and offsetLeft)
// and take into account location of .base element to determine
// the row for which y = 0.
var newSymbolX = [];
var newSymbolY = [];
function loadFromEditor() {
  newSymbolX = [];
  newSymbolY = [];
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
// ========================================
function resetEditor() {
  var activeCells = document.querySelectorAll('.cell.active');
  for (var i = 0; i < activeCells.length; i++) {
    activeCells[i].classList.remove('active');
  }
  currentSymbol = document.querySelector('#currentSymbol');
  currentSymbol.value = '';
  symbolCode = document.querySelector('#symbolCode');
  symbolCode.value = '';
}
// ========================================
function addListeners() {
  var labels = document.querySelectorAll('.label');
  for (var i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click',tabListener);
  }
}
// ========================================
function adjustDisplay() {
  panels = document.querySelector('.panels');
  newTop = (window.innerHeight - panels.offsetHeight)/2;
  display = document.querySelector('.display');
  display.style.top = newTop + 'px';
}
// ========================================
function hideForces() {
  var settings = document.querySelector('.panels>.tab.settings');
  var hidden = settings.classList.contains('hidden');
  var forceWrapper = document.querySelector('#forceWrapper');
  var style = hidden ? 'none' : 'unset';
  forceWrapper.style.display = style;
}
// ========================================
function panelsObserver() {
  var observer = new MutationObserver(adjustDisplay);
  var target = document.querySelector('.labels');
  var config = {attributes: true, attributeFilter: ['class']};
  observer.observe(target, config);
}
// ========================================
function windowListeners() {
  window.addEventListener('resize', function(){
    adjustDisplay();
    adjustDBWindow();
    adjustPanelHeight();
    displayX = display.offsetLeft;
  });
}
// ========================================
// Define text content and 'click' event handler
// for #alert element.
function showAlert(text,callback) {
  var alert = document.querySelector('#alert');
  alert.style.display = 'unset';
  alert.querySelector('.text').innerHTML = text;
  var yes = alert.querySelector('.yes');
  yes.addEventListener('click', handler);

  function handler() {
    callback();
    yes.removeEventListener('click', handler);
    closeAlert();
  }
}
// ========================================
function closeAlert() {
  alert = document.querySelector('#alert');
  alert.style.display = 'none';
}
// ========================================
// Keep force settings in panel synchronised
// with changes in their 'visual' UI.
function forcesObserver() {
  var observer = new MutationObserver(syncSettings);
  // var target = document.querySelector('.labels');
  // var config = {attributes: true, attributeFilter: ['class']};
  observer.observe(target, config);
}
function settingsObserver() {
  var observer = new MutationObserver(syncSettings);
  // var target = document.querySelector('.labels');
  // var config = {attributes: true, attributeFilter: ['class']};
  observer.observe(target, config);
}
function syncSettings() {

  // Hide settings if no force is currently selected
}
// ========================================
function showForceSettings() {
  var element = document.querySelector('.settings.forces');
  element.classList.toggle('hidden');
  adjustPanelHeight();
}
// ========================================
function adjustPanelHeight() {
  // Bottom tabs
  var tabs = document.querySelector('.tabs');
  // Main window
  var main = document.querySelector('main');
  var mainHeight = parseInt(getComputedStyle(main).height);
  // Remaining height
  var height = mainHeight - tabs.offsetHeight;
  // Panel
  var panel = document.querySelector('.settings.forces');
  panel.style.height = height + 'px';
}
// ========================================
function checkScroll(target) {
  var paragraphs = target.querySelectorAll('p');
  var lastP = paragraphs[paragraphs.length - 1];
  var fullScroll = (lastP.offsetTop + lastP.offsetHeight) -
                    target.offsetHeight;
  if(target.scrollTop == fullScroll) {
    target.classList.add('scrolled');
  } else {
    target.classList.remove('scrolled');
  }
}
// ========================================
