createGrid();
aggregate();
// letters currently have always 4 pixels in height
// So 2 is half on the height of the text
layout(batch, -textLen/2,-2);

function showTab(string) {
  var panels = document.querySelectorAll('.panels .tab');
  var labels = document.querySelectorAll('.label');
  var labelsSection = document.querySelector('.labels');
  for (var i = 0; i < panels.length; i++) {
    if (panels[i].classList.contains(string)) {
      // Toggle state of label that was clicked
      if (labels[i].classList.contains('active')) {
        // If clicked label was active, deactivate
        // all tabs
        labelsSection.classList.remove('active');
      }
      else {
        labelsSection.classList.add('active');
      }
      panels[i].classList.toggle('hidden');
      labels[i].classList.toggle('active');
    }
    else {
      // Hide tabs of labels that were not clicked
      panels[i].classList.add('hidden');
      labels[i].classList.remove('active');
    }
  }
}

function dbWidnowHeight() {
  var main = document.querySelector('main');
  var panels = document.querySelector('div.panels .tab');
  var mainHeight = parseInt(getComputedStyle(main).height);
  var height = mainHeight - panels.offsetHeight;
  var databaseWindow = document.querySelector('div.database');
  databaseWindow.style.height = height - 1 + 'px';
}

function showDatabase() {
  var el = document.querySelector('div.database');
  el.classList.toggle('hidden');
  dbWidnowHeight();
}

// ========================================
function takeInput(target) {
  var property = target.name;
  console.log(get[property]);
  get[property] = parseFloat(target.value);
  console.log(get[property]);
}

// ========================================
function userForm(target) {
  var form = document.querySelector('#userForm');
  if (target.name == "login") {
    form.action = "javascript:login()";
  }
  else if (target.name == "register") {
    form.action = "javascript:register()";
  }
  hideUserForm();
}

function hideUserForm() {
  if (document.cookie.search('PHPSESSID') != -1) {
    form.style.display = 'none';
  }
}


function logout() {
  var cookies = document.cookie;
  var cookieStart = cookies.search('PHPSESSID');
  var cookieEnd = cookies.
}
