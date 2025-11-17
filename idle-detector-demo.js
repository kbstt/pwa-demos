function startIdleDetector() {
  if (!window.IdleDetector) {
    alert("Idle Detection API is not available in your browser");
    return;
  }
  
  try {
    let idleDetector = new IdleDetector({ threshold: 20 });
    idleDetector.addEventListener('change', function(){
       alert("userState: "+idleDetector.userState+" / screenState: "+idleDetector.screenState);
    });
    idleDetector.start();
  } 
  catch (error) {
    alert('Idle Detection error:' + error);
  }
}
