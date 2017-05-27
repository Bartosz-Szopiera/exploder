// ======================================
// Download table with settings
function getSettings() {
  return JSON.parse(ajaxRequest('POST'));
}
// ======================================
// Register user
function register() {
  var response =  ajaxRequest('POST', 'register', 'add_user.php');
  //
}
// ======================================
// Login
function login() {
  return ajaxRequest('POST', 'login', 'login.php')
}
// ======================================
// Upload settings
function saveSettings() {
  return ajaxRequest('POST', 'settings', 'post_settings.php')
}
// ======================================
function ajaxRequest(method,formID,url) {
  if (method == "POST") {
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
      if (xhr.status === OK )
      console.log(xhr.responseText); // Returned text
      return xhr.responseText;
    }
    else {
      console.log('Error: ' + xhr.status); // Log error
    }
  };
}
