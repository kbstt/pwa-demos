function startDrag(e) {
  var targetElement = this;
  
  // 1. TRACKING ID:
  // If it's a touch event, get the unique ID of the finger that started THIS drag.
  // If it's a mouse, we use null (or a dummy ID).
  var activeTouchId = (e.changedTouches) ? e.changedTouches[0].identifier : null;

  if (e.preventDefault) { e.preventDefault(); }

  var pos = [targetElement.offsetLeft, targetElement.offsetTop];
  var origin = getCoors(e, activeTouchId);

  // 2. USE ADDEVENTLISTENER:
  // We use addEventListener so multiple listeners can exist on the document simultaneously.
  // We pass { passive: false } to allow preventDefault() to work on mobile.
  document.addEventListener('mousemove', moveDrag);
  document.addEventListener('touchmove', moveDrag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  function moveDrag(e) {
    // 3. FILTER EVENTS:
    // Get coordinates strictly for OUR specific finger/mouse
    var currentPos = getCoors(e, activeTouchId);

    // If getCoors returns null, it means the event fired for a DIFFERENT finger.
    // We ignore it and return immediately.
    if (!currentPos) return; 

    var deltaX = currentPos[0] - origin[0];
    var deltaY = currentPos[1] - origin[1];

    targetElement.style.left = (pos[0] + deltaX) + 'px';
    targetElement.style.top = (pos[1] + deltaY) + 'px';
    
    if(e.preventDefault) e.preventDefault(); // Prevent scrolling while dragging
  }

  function endDrag(e) {
    // Check if the ended touch is actually OUR touch
    if (activeTouchId !== null && e.changedTouches) {
        var isOurTouch = false;
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchId) {
                isOurTouch = true;
                break;
            }
        }
        if (!isOurTouch) return; // Someone else lifted a finger, not us
    }

    // Cleanup: Remove ONLY the listeners created for this specific instance
    document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchmove', moveDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  }

  // Helper to get coordinates based on the specific Touch ID
  function getCoors(e, touchId) {
    // Mouse handling
    if (!e.changedTouches) {
      return [e.clientX, e.clientY];
    }

    // Touch handling: Loop through changed touches to find OUR finger
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        return [
          e.changedTouches[i].clientX, 
          e.changedTouches[i].clientY
        ];
      }
    }
    
    // If our finger didn't move in this event, return null
    return null;
  }
}

function initializeDragging(){
  var elements = document.querySelectorAll('.draggable-box');
  [].forEach.call(elements, function (element) {
    // Note: using addEventListener here is also safer than 'onmousedown ='
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
  });
   
  document.addEventListener('gesturechange', function(e) {
     e.preventDefault();
  });
}

window.addEventListener("load", initializeDragging);
