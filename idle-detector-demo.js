function startIdleDetector() {
  if (!window.IdleDetector) {
    alert("Idle Detection API is not available in your browser");
    return;
  }
  
  try {
    let permission = await IdleDetector.requestPermission();
    if (permission !== "granted"){throw "Idle Detector permission denied";}
    let idleDetector = new IdleDetector({ threshold: 60 });
    idleDetector.addEventListener('change', function(){
       alert("userState: "+idleDetector.userState+" / screenState: "+idleDetector.screenState);
    });
    idleDetector.start();
  } 
  catch (error) {
    alert(error);
  }
}
