// ========================================
// Draw a basic parts for the protoForce
function drawForce(canvas, id) {
  // Draw range
  if (!canvas) {
    var canvas = document.querySelector('#protoForce .range');
  }
  canvas.width = 80;
  canvas.height = 80;
  var ctx = canvas.getContext('2d');
  var centerX = canvas.width*0.5;
  var centerY = canvas.height*0.5;
  ctx.beginPath();
  ctx.lineWidth = centerX;
  ctx.strokeStyle = 'rgba(30,155,30,0.5)';
  // Define parameter of the arc for the default force
  var radius = centerX*0.5;
  var rad1 = forces[id].rad1;
  var rad2 = forces[id].rad2;
  var start = rad1 + 2*Math.PI;
  var end = rad2;
  var shift = 2*Math.PI;

  ctx.arc(centerX,centerY,radius,shift - start, shift - end, true);
  ctx.stroke();

  // var rangeCanv = document.querySelector('#protoForce .range');
  // var valueCanv = document.getElementById('#protoForce .value');
  // var rangeCtx = rangeCanv.getContext('2d');
  // var valueCtx = valueCanv.getContext('2d');
}
// ========================================
function updateRange(id, force) {
  var rad1 = forces[id].rad1;
  var rad2 = forces[id].rad2;
  console.log('updating:');
  console.log('rad1: ' + rad1);
  console.log('rad2: ' + rad2);
  var rangeCanvas = force.querySelector('.range');
  drawForce(rangeCanvas, id);
}
// ========================================
function updateValue(id) {

}
// ========================================
function updateDirection(id) {

}
// ========================================
function updateRotation(id) {

}
// ========================================
function updateType(id) {
  updateRange();
  updateValue();
  updateDirection();
  updateRotation();
}
// ========================================
// position - X,Y of force placement in local coordinates of .display
// rad1 - X,Y defining first perimeter of affected space
// rad2 - X,Y defining second perimeter of affected space
// rad3 - X,Y defining direction of simpleForce
// rot - (+1 or -1) defines direction of vortex rotation
// duration - (0 or 1) acts one time or continuously
// type - (1,2 or 3) radial force, one direction force or vortex
// radialForce - force acting radlial form it's center
// simpleForce - force acting in one direction
// vortex - force which spins around
// ========================================
var forces = {};
// ========================================
var defaultForce = {
  type1 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.60*Math.PI,
    'rad2'    : 1.40*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'rot'     : 1,
    'duration' : 0,
    'type'     : 1,
  },
  type2 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.5*Math.PI,
    'rad2'    : 1.5*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'rot'     : 1,
    'duration' : 0,
    'type'     : 2,
  },
  type3 : {
    'position'  : null,
    'value'   : 0.5,
    'rad1'    : 1.5*Math.PI,
    'rad2'    : 1.5*Math.PI,
    'rad3'    : 0.5*Math.PI,
    'rot'     : 1,
    'duration' : 0,
    'type'     : 3,
  },
};
// ========================================
// Make ready to create a new force
function addForce(target) {
  window.addEventListener('mousedown', createForce);
  target.classList.add('active');
}
// ========================================
// Create new force at clicked location.
// --Global variables--
// Index for each new force:
  var forceIndex = 0;
// Container for all currently attached handlers of
// events for force modification:
  var handlers = [];
// --Function--
function createForce() {
  var protoForce = document.querySelector('#protoForce');
  var force = protoForce.cloneNode(true);
  force.id = '';
  force.className = 'force';
  var forceWrapper = document.querySelector('#forceWrapper');
  forceWrapper.appendChild(force);
  forceIndex ++;
  force.dataset.forceIndex = forceIndex;
  force.style.display = 'flex';
  // Attach listeners to manipulate force
  var rad3Element = force.querySelector('.rad3');
  var rangeElement = force.querySelector('.range');
  var valueElement = force.querySelector('.value');
  var typeElement = force.querySelector('.type');
  // Attach listeners:
  // Control direction
  rad3Element.addEventListener('mousedown', function(){
    modifyDirection(force, true);
    var handler = function(){modifyDirection(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control area of influence
  rangeElement.addEventListener('mousedown', function(){
    modifyRange(force, true);
    var handler = function(){modifyRange(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control force value
  valueElement.addEventListener('mousedown', function(){
    modifyValue(force, true);
    var handler = function(){modifyValue(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', stopModifying);
  });
  // Control force type and force location
  typeElement.addEventListener('mousedown', function(){
    if(typeElement.dataset.dbclick == true) return
    // Drag to move force:
    var handler = function(){moveForce(force)};
    handlers.push(handler);
    window.addEventListener('mousemove', handler);
    // Stop dragging behavior
    window.addEventListener('mouseup', stopModifying);
    // Allow doubleclick to change type
    typeElement.addEventListener('mouseup', dbClick);
    function dbClick() {
      typeElement.dataset.dbclick = true;
      typeElement.addEventListener('mousedown', modifyType);
      setTimeout(function(element){
        element.removeEventListener('mousedown', modifyType);
        element.dataset.dbclick = false;
      }, 250, typeElement);
      typeElement.removeEventListener('mouseup', dbClick);
    }
  });
  // Get click position
  var globalX = event.clientX;
  var globalY = event.clientY;
  // Get position of .display center
  // var display = document.querySelector('.display');
  var centerX = display.offsetLeft;
  var centerY = display.offsetTop;
  // Get position of force in local system of the display
  var localX = globalX - centerX;
  var localY = globalY - centerY;
  // Position force in local system of the display
  force.style.left = localX + 'px';
  force.style.top = localY + 'px';
  // Define basic properties
  Object.defineProperty(forces, forceIndex, {
    configurable: true,
    value: defaultForce.type1
  });
  // Update position inside the object
  forces[forceIndex].position = [localX,localY];
  window.removeEventListener('mousedown', createForce);
  document.getElementById('addForce').classList.remove('active');
  // Draw properties of the force on canvas
  updateRange(forceIndex, force);
}
// ========================================
// Remove all window event associated with
// modifying force.
function stopModifying() {
  console.log('removing handlers');
  for (var i = 0; i < handlers.length; i++) {
    window.removeEventListener('mousemove', handlers[i]);
  }
  window.removeEventListener('mouseup', stopModifying);
  // Clear an array
  handlers = [];
}
// ========================================
// Modify existing force
// action - type of event
// start (bool) - was event just attached?
var cursorX, cursorY, cursorOldX, cursorOldY;
var refVec = [1,0]; // reference vector indicating 0' angle
// ========================================
function modifyDirection(target, start) {
  console.log('modifyDirection');
  var id = parseInt(target.dataset.forceIndex);
  if (forces[id].type != 2) return
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    // Define change in direction
    angleDelta = vectorAngle([x,y],[xOld,yOld]);
    relativeDeltaNew = relativeAngle([x,y]);
    relativeDeltaOld = relativeAngle([xOld,yOld]);
    relativeDelta = relativeDeltaOld - relativeDeltaNew;
    if (relativeDelta == angleDelta) {
      angleDelta = relativeDelta;
    }
    // Apply new direction to the force
    prop.rad3 += angleDelta;
    // APPLY CHANGE TO THE ELEMENT STYLE
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyRange(force, start) {
  console.log('modifyRange');
  var id = parseInt(force.dataset.forceIndex);
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    console.log('changing range direction');
    // Define change in direction
    angleDelta = vectorAngle([x,y],[xOld,yOld]);
    relativeDeltaNew = relativeAngle([x,y]);
    relativeDeltaOld = relativeAngle([xOld,yOld]);
    relativeDelta = relativeDeltaOld - relativeDeltaNew;
    if (relativeDelta == angleDelta) {
      angleDelta = relativeDelta;
    }
    // Rotate influence borders (rad1 rad2)
    prop.rad1 += angleDelta;
    prop.rad2 += angleDelta;
    // Define change in range (space covered)(rad1-rad2 cone)
    var delta = vectorLength([x,y]) - oldLength;
    prop.rad1 -= (2*Math.PI)/360*delta; //?????
    prop.rad1 += (2*Math.PI)/360*delta; //?????
    // APPLY CHANGE TO THE ELEMENT STYLE
    updateRange(id, force);
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyValue(target, start) {
  console.log('modifyValue');
  var id = parseInt(target.dataset.forceIndex);
  var prop = forces[id];
  var oldPosition = prop.position;
  // Read current cursor position;
  x = event.clientX;
  y = event.clientY;
  if (!start) {
    var delta = vectorLength([x,y]) - oldLength;
    prop.value += delta/10;
    // APPLY CHANGE TO THE ELEMENT STYLE
  }
  // Record current values;
  xOld = x;
  yOld = y;
  oldLength = vectorLength([xOld,yOld]);
}
// ========================================
function modifyType() {
  console.log('modifyType');
  this.removeEventListener('mousedown', modifyType);
  this.dataset.dbclick = false;
  var force = this.parentNode.parentNode;
  var id = parseInt(force.dataset.forceIndex);
  // Record current position
  // oldPosition = [forces[id].position];
  oldPosition = forces[id].position;
  // Change type of emitted force
  var type = forces[id].type;
  type = type == 3 ? 1 : type + 1;
  // Remove old force from 'forces' object
  delete forces[id];
  // Insert new force of given type
  Object.defineProperty(forces, id, {
    configurable: true,
    value: defaultForce['type' + type]
  });
  var typeElement = force.querySelector('.type');
  typeElement.dataset.forceType = type;
  // Restore force position
  forces[id].position = oldPosition;

  // Reload graphic of the force to depict changed values
  // redrawForce(id, 'all');
}
// ========================================
function removeForce() {
  var button = document.getElementById('removeForce');
  var forceWrapper = document.getElementById('forceWrapper');
  var force = this.parentNode.parentNode;
  forceWrapper.removeChild(force); //remove from DOM
  var id = force.dataset.forceIndex;
  delete forces[id]; //remove from objcet
  selectToDelete();
}
function selectToDelete() {
  var forces = document.querySelectorAll('.force');
  var button = document.getElementById('removeForce');
  if (button.classList.contains('active')) {
    for (var i = 0; i < forces.length; i++) {
      forces[i].querySelector('.type').removeEventListener('click', removeForce);
    }
    button.classList.remove('active');
  }
  else {
    button.classList.add('active');
    for (var i = 0; i < forces.length; i++) {
      forces[i].querySelector('.type').addEventListener('click', removeForce);
    }
  }
}
// ========================================
function moveForce(target) {
  // console.log('moveForce');
  // console.log(target);
  var force = target;
  var forceIndex = force.dataset.forceIndex;
  // Get click position
  var globalX = event.clientX;
  var globalY = event.clientY;
  // Get position of .display center
  // var display = document.querySelector('.display');
  var centerX = display.offsetLeft;
  var centerY = display.offsetTop;
  // Get position of force in local system of the display
  var localX = globalX - centerX;
  var localY = globalY - centerY;
  // Position force in local system of the display
  force.style.left = localX + 'px';
  force.style.top = localY + 'px';
  forces[forceIndex].position = [localX,localY];
  // Disable option to double-click to change type
  var typeElement = target.querySelector('.type');
  typeElement.removeEventListener('click', modifyType);
}
// ========================================
function pointsDistance(p1,p2) {
  var distance = vectorLength([p1[0]-p2[0], p1[1]-p2[1]]);
  return distance
}
// ========================================
function vectorLength(point) {
  var length = Math.sqrt(point[0]*point[0] + point[1]*point[1]);
  return length;
}
// ========================================
// Angle between vectors 1 and 2
function vectorAngle(v1,v2) {
  var dotProd = v1[0]*v2[0] + v1[1]*v2[1];
  var v1Len = vectorLength(v1);
  var v2Len = vectorLength(v2);
  var angle = Math.acos(dotProd/(v1Len*v2Len)); //radians
  return angle
}
// ========================================
// Measure angle between vector and vector [1,0]
// assuming that angles are measured always from
// [1,0] and clockwise
function relativeAngle(v) {
  var dotProd = v[0];
  var vLen = vectorLength(v);
  var angle = Math.acos(dotProd/vLen); //radians
  angle = v[1] > 0 ? angle : (Math.PI*2 - angle);
  return angle
}
// ========================================
// Return coordinates of versor which creates
// with versor [1,0] given angle
function angToVector(angle) {
  var x = Math.cos(angle);
  // if (angle < Math.PI) {
  //   angle = Math.abs(angle);
  // }
  var y = Math.sqrt(1-x*x);
  if (angle > Math.PI) {
    y = -y;
  }
  return [x,y]
}
// ========================================
function sumVector(v1,v2) {
  return [v1[0]+v2[0],v1[1]+v2[1]]
}
// ========================================
