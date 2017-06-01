// ======================================
// Register user
function register() {
  ajaxRequest('POST', 'userForm', 'add_user.php', toggleUserForm, updateTable);
}
// ======================================
// Login
function login() {
  ajaxRequest('POST', 'userForm', 'login.php', toggleUserForm, updateTable);
}
// ======================================
// Logout
function logout() {
  ajaxRequest('POST', '', 'logout.php', toggleUserForm, updateTable);
}
// ========================================
// Check if user is logged-in
function isLogged() {
  ajaxRequest('GET', '', 'islogged.php', toggleUserForm, getSettings);
}
// ======================================
// Upload settings
function postSettings() {
  ajaxRequest('POST', 'settingsForm', 'post_settings.php', getSettings);
}
// ======================================
// Download table with settings
function getSettings() {
  ajaxRequest('GET','','get_settings_table.php', updateTable);
  // ajaxRequest('GET','','get_settings_table.php');
}
// ======================================
// Debug
function debug() {
  var response = ajaxRequest('GET', '', 'test.php');
}
// ======================================
// Perform ajax request with given HTTP method
// optionally POSTing data from given form,
// pointing the connection to a given URL, and
// executing callback function
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
        if (contentType == 'application/json') {
          var response = JSON.parse(xhr.responseText);
          console.log(response.success);
          console.log(response.msg);
        }
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
