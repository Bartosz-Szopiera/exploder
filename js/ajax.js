// ======================================
// Register user
function register() {
  ajaxRequest('POST', 'userForm', 'add_user.php', toggleUserForm, getData);
}
// ======================================
// Login
function login() {
  ajaxRequest('POST', 'userForm', 'login.php', toggleUserForm, getData);
}
// ======================================
// Logout
function logout() {
  ajaxRequest('POST', '', 'logout.php', toggleUserForm, getData);
}
// ========================================
// Check if user is logged-in
function isLogged() {
  ajaxRequest('GET', '', 'islogged.php', toggleUserForm, getData);
}
// ======================================
// Upload settings
function postSettings() {
  var current_settings = document.querySelector('#currentSettings').value;
  var settings_name = document.querySelector('#settingsName').value;
  if (settings_name === '') console.log('Settings name is missing.');
  var postData = {
    'current_settings'  : current_settings,
    'settings_name'     : settings_name,
    'settings'  : setup,
    'forces'    : forces,
  }
  ajaxRequest('POST', postData, 'post_settings.php', getData);
}
// ======================================
// Download table with settings
function getSettings() {
  ajaxRequest('GET','','get_settings_table.php', updateTable);
}
// ======================================
// Create new symbol
function addSymbol() {
  var activeCells = document.querySelectorAll('.cell.active');
  if (activeCells.length == 0) {
    return console.log('Draw your symbol in the above grid.')
  }

  var inputX = document.querySelector('#newSymbolX');
  var inputY = document.querySelector('#newSymbolY');
  loadFromEditor();
  inputX.value = newSymbolX.toString();
  inputY.value = newSymbolY.toString();

  ajaxRequest('POST','newSymbolForm','add_symbol.php', getData);
}
// ======================================
// Download data from symbols table
function getSymbols() {
  ajaxRequest('GET','','get_symbols_table.php',updateTable,adaptServerData);
}
// ======================================
function getData() {
  getSettings();
  getSymbols();
}
// ========================================
function changeSymbol() {
  var activeCells = document.querySelectorAll('.cell.active');
  if (activeCells.length == 0) {
    return console.log('Draw your symbol in the above grid.')
  }
  // Do initial validation (any final vaidation takes place
  // on the server anyway)
  currentSymbol = document.querySelector('#currentSymbol').value;
  symbolCode = document.querySelector('#symbolCode').value;
  // Is symbol to edit defined?
  if (currentSymbol == '') {
    return console.log('Choose symbol to edit or provide its code in \'Current Symbol\' field.')
  }
  // Is session started?
  if (document.cookie.search('PHPSESSID') == -1 ||
      document.querySelector('.userProfile.logged') == null) {
      return console.log('You need to log-in to edit.')
  }
  // Laod symbol from the grid
  var inputX = document.querySelector('#newSymbolX');
  var inputY = document.querySelector('#newSymbolY');
  loadFromEditor();
  inputX.value = newSymbolX.toString();
  inputY.value = newSymbolY.toString();

  var text = "Do you really want to change current symbol?";
  showAlert(text, function(){
    ajaxRequest('POST','newSymbolForm','change_symbol.php', getData);
  });
}
// ========================================
function deleteSymbol() {
  // Do initial validation (any final validation takes place
  // on the server anyway)
  currentSymbol = document.querySelector('#currentSymbol').value;
  // Is symbol to edit defined?
  if (currentSymbol == '') {
    return console.log('Choose symbol to delete or provide its code in \'Current Symbol\' field.')
  }
  // Is session started?
  if (document.cookie.search('PHPSESSID') == -1 ||
      document.querySelector('.userProfile.logged') == null) {
      return console.log('You need to log-in to delete.')
  }

  var text = "Do you really want to delete current symbol?";
  showAlert(text, function(){
    ajaxRequest('POST','newSymbolForm','delete_symbol.php', getData);
  });
}
// ========================================
function changeSettings() {
  // Do initial validation (any final validation takes place
  // on the server anyway)
  currentSettings = document.querySelector('#currentSettings').value;
  // Is symbol to edit defined?
  if (currentSettings == '') {
    return console.log('Choose settings to change or provide their name in \'Current Settings\' field.')
  }
  // Is session started?
  if (document.cookie.search('PHPSESSID') == -1 ||
      document.querySelector('.userProfile.logged') == null) {
      return console.log('You need to log-in for this action.')
  }

  var text = "Do you really want to change current settings?";
  showAlert(text, function(){
    ajaxRequest('POST','settingsForm','change_settings.php', getData);
  });
}
// ========================================
function deleteSettings() {
  // Do initial validation (any final validation takes place
  // on the server anyway)
  currentSettings = document.querySelector('#currentSettings').value;
  // Is symbol to edit defined?
  if (currentSettings == '') {
    return console.log('Choose settings to delete or provide their name in \'Current Settings\' field.')
  }
  // Is session started?
  if (document.cookie.search('PHPSESSID') == -1 ||
      document.querySelector('.userProfile.logged') == null) {
      return console.log('You need to log-in for this action.')
  }

  var text = "Do you really want to delete current settings?";
  showAlert(text, function(){
    ajaxRequest('POST','settingsForm','delete_settings.php', getData);
  });
}
// ======================================
// Debug
function test() {
  ajaxRequest('GET', '', 'test.php');
}
// ======================================
// Perform ajax request with given HTTP method
// optionally POSTing data from given form,
// pointing the connection to a given URL,
// and executing callback functions:
//   callback1 for successful response and
//   callback2 as long as it was provided.
function ajaxRequest(method,postData,url,callback1, callback2) {
  // Payload is a form
  if (method == "POST" && postData != '' && typeof(postData) != 'object') {
    var formElement = document.querySelector('#' + postData);
    var data = new FormData(formElement);
  }
  // Payload is a prepared object
  else if (method === "POST" && typeof(postData) === 'object' ) {
    var data = JSON.stringify(postData);
    console.log(data);
  }
  // No payload
  else {
    var data = null;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.send(data);
  xhr.onreadystatechange = function() {
    var DONE = 4; // state 4 - request completed.
    var OK = 200; // status 200 - successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK ) {
        console.log('AJAX performed');
        var contentType = xhr.getResponseHeader("Content-type");
        console.log(contentType);
        // Every response comes back in JSON but sometimes
        // if there is an mysqli_error it will actually not
        // be encoded yet the header will state 'application/json'
        // and parser will throw an exception on that.
        // So there is 'try - catch' block.
        if (contentType == 'application/json') {
          try {
            var response = JSON.parse(xhr.responseText);
            console.log(response.success);
            console.log(response.msg);
          }
          catch (e) {
            var response = xhr.responseText;
            console.log(
              'There was an error: \n -> '
              + e + '\n'
              + 'Complete server response: \n -->'
              + xhr.responseText
            );
          }
        }
        // If however data format was not JSON in the end..
        else {
          var response = xhr.responseText;
          console.log(response);
        }
        if (response.success) {
          if (typeof(callback1) == 'function') {
            callback1(response);
            console.log('Callback1 executed');
          }
        }
        if (typeof(callback2) == 'function') {
          callback2(response);
          console.log('Callback2 executed');
        }
      }
    }
    else {
      console.log('Error: ' + xhr.status); // Log error
    }
  };
}
