function toggleWakeLock(){
  if (!navigator.wakeLock){
    alert("Your device does not support the Wake Lock API. Try on an Android phone!");
  }
  else if (window.currentWakeLock && !window.currentWakeLock.released){
    releaseScreen();
  }
  else {
    lockScreen();
  }

}

async function lockScreen(){
   try {
       window.currentWakeLock = await navigator.wakeLock.request();
       document.getElementById('wake-lock-btn').innerHTML = "Release Wake Lock";
       alert('Wake Lock enabled');
    }
    catch(err){
      alert(err);
    }
}

async function releaseScreen(){
  window.currentWakeLock.release();
  document.getElementById('wake-lock-btn').innerHTML = "Start Wake Lock";
  alert('Wake Lock released');
}
