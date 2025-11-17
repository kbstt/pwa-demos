function getState() {
  if (document.visibilityState === "hidden") {
    return "hidden";
  }
  if (document.hasFocus()) {
    return "focused";
  }
  return "not focused";
};

window.currentPageLifeCycleState = getState();

function initializePageLifecycleLog(){
  logStateChange("loaded");
  ["pageshow", "focus", "blur", "visibilitychange", "resume"].forEach(function (type) {
    window.addEventListener(type, function(){
      logStateChange(getState());
    }, {capture: true});
  });

  window.addEventListener("freeze", function(){
    logStateChange("frozen");
  }, {capture: true});
  
  window.addEventListener("pagehide", function(){
    if (event.persisted) {
      // If the event's persisted property is `true` the page is about
      // to enter the page navigation cache, which is also in the frozen state.
      logStateChange("frozen");
    } 
    else {
      // If the event's persisted property is not `true` the page is about to be unloaded.
      logStateChange("terminated");
    }
  }, {capture: true});
}

function logStateChange(nextState) {
  var prevState = window.currentPageLifeCycleState;
  if (nextState === "loaded"){prevState = "loading";}
  if (nextState !== prevState) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newLog = document.createElement('div');
    //newLog.innerHTML = '' + timeBadge + ' State changed from ' + prevState + ' to ' + nextState + '.';
    newLog.innerHTML = "<span>" + timeBadge + "</span><div>State changed from </div><pre>" + prevState+ "</pre> to <pre>"+nextState+"</pre>";   
    document.getElementById('page-lifecycle-log').appendChild(newLog);
    window.currentPageLifeCycleState = nextState;
  }
};

window.addEventListener("load", initializePageLifecycleLog);
