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
// Display grid for creating and editing symbols
function buildGrid(width,height) {
  var grid = document.querySelector('.grid');
  var cell = document.querySelector('.cell');
  var cellWidth = pixelWidth;
  var cellsInRow = Math.floor(width/cellWidth);
  var cellsInColumn = Math.floor(height/cellWidth);
  grid.style.maxWidth = cellsInRow * cellWidth + 'px';
  grid.style.maxHeight = cellsInColumn * cellWidth + 'px';
  for (var i = 1; i < cellsInRow*cellsInColumn; i++) {
    grid.appendChild(cell.cloneNode());
  }
}
function showGrid() {
  removePixels();
  var grid = document.querySelector('.grid');
  grid.classList.toggle('hidden');
}
// ========================================
function selectCell(target) {
  target.classList.toggle('active');
  //New symbol defined in database friendly format
  // newSymbolX
  // newSymbolY
}
