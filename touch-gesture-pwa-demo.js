function startDrag(e) {
  var targetElement = this; 

  if (e.preventDefault) { e.preventDefault(); }

  document.onmousemove = document.ontouchmove = document.onmspointermove = moveDrag;

  document.onmouseup = document.ontouchend = document.onmspointerup = function () {
    document.onmousemove = document.ontouchmove = document.onmspointermove = null;
    document.onmouseup = document.ontouchend = document.onmspointerup = null;
  };

  var pos = [targetElement.offsetLeft, targetElement.offsetTop];
  var origin = getCoors(e);

  function moveDrag(e) {
    var currentPos = getCoors(e);
    var deltaX = currentPos[0] - origin[0];
    var deltaY = currentPos[1] - origin[1];
    
    targetElement.style.left = (pos[0] + deltaX) + 'px';
    targetElement.style.top = (pos[1] + deltaY) + 'px';
    return false; 
  }

  function getCoors(e) {
    var coors = [];
    if (e.targetTouches && e.targetTouches.length) {
      var thisTouch = e.targetTouches[0];
      coors[0] = thisTouch.clientX;
      coors[1] = thisTouch.clientY;
    } else {
      coors[0] = e.clientX;
      coors[1] = e.clientY;
    }
    return coors;
  }
}

function initializeDragging(){
  var elements = document.querySelectorAll('.draggable-box');
  [].forEach.call(elements, function (element) {
    element.onmousedown = element.ontouchstart = element.onmspointerdown = startDrag;
  });
   
  document.ongesturechange = function () {
    return false;
  }
}

window.addEventListener("load", initializeDragging);
