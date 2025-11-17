function initializePageVisibilityLog(){
  var container = document.getElementById('page-visibility-log');
  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } 
  else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } 
  else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } 
  else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  } 
  else {
    container.innerText = 'Page Visibility API not supported.';
  }
  
  document.addEventListener(visibilityChange, function(){
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newState = document.createElement('div');
    newState.innerHTML = '' + timeBadge + ' Page visibility changed to ' + (document[hidden] ? 'hidden' : 'visible') + '.';
    container.appendChild(newState);
  }, false);

}

window.addEventListener("load", initializePageVisibilityLog);
