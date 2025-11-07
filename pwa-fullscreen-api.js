function toggleFullscreen(container) {
  let unsupported = () => alert("Your current browser does not support the Fullscreen API");
  let element = container || document.documentElement;
  let isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (isFullscreen) {
    let exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (exitFullscreen){ 
      exitFullscreen.call(document);     
    }
    else {
      unsupported();
    }
  } 
  else {
    let enterFullscreen = element.requestFullscreen || element.webkitRequestFullscreen || element.msRequestFullscreen || element.mozRequestFullScreen;
    if (enterFullscreen){
      enterFullscreen.call(element);
    }
    else {
      unsupported();
    }
  }
}
