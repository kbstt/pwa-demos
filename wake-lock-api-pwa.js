function startWakeLock(){
  if (!navigator.wakeLock){
    alert("Your device does not support the Wake Lock API. Try on a iPhone or Android phone!");
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
    }
    catch(err){
      alert(err);
    }
}

async function releaseScreen(){
  await navigator.wakeLock.release();
  document.getElementById('wake-lock-btn').innerHTML = "Start Wake Lock";
}
