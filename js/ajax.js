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
  ajaxRequest('POST', 'settingsForm', 'post_settings.php', getData);
}
// ======================================
// Download table with settings
function getSettings() {
  ajaxRequest('GET','','get_settings_table.php', updateTable);
}
// ======================================
// Create new symbol
function addSymbol() {
  inputX = document.querySelector('#newSymbolX');
  inputY = document.querySelector('#newSymbolY');
  loadFromEditor();
  inputX.value = newSymbolX.toString();
  inputY.value = newSymbolY.toString();

  ajaxRequest('POST','newSymbolForm','add_symbol.php',getSymbols);
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
// ======================================
// Debug
function debug() {
  ajaxRequest('GET', '', 'test.php');
}
// ======================================
// Perform ajax request with given HTTP method
// optionally POSTing data from given form,
// pointing the connection to a given URL,
// and executing callback functions:
//   callback1 for successful response and
//   callback2 as long as it was provided.
function ajaxRequest(method,formID,url,callback1, callback2) {
  if (method == "POST" && formID != '') {
    var formElement = document.querySelector('#' + formID);
    var data = new FormData(formElement);
  }
  else {
    data = null;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.send(data);
  xhr.onreadystatechange = function() {
    var DONE = 4; // state 4 - request in completed.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK ) {
        console.log('AJAX performed');
        var contentType = xhr.getResponseHeader("Content-type");
        console.log(contentType);
        // Every response comes back in JSON but sometimes
        // if there is and mysqli_error it will actually not
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
