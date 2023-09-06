async function getMotion(){
  if (!window.DeviceMotionEvent || !window.DeviceMotionEvent.requestPermission){
    return alert("Your current device does not have access to the DeviceMotion event");
  }

  let permission = await window.DeviceMotionEvent.requestPermission();
  if (permission !== "granted"){
    return alert("You must grant access to the device's sensor for this demo");
  }
}

window.addEventListener("devicemotion", function(e){
  document.getElementById('acceleration-x').innerHTML = e.acceleration.x.toFixed(2)+"m/s²";
  document.getElementById('acceleration-y').innerHTML = e.acceleration.y.toFixed(2)+"m/s²";
  document.getElementById('acceleration-z').innerHTML = e.acceleration.z.toFixed(2)+"m/s²";
  
  document.getElementById('acceleration-gravity-x').innerHTML = e.accelerationIncludingGravity.x.toFixed(2)+"m/s²";
  document.getElementById('acceleration-gravity-y').innerHTML = e.accelerationIncludingGravity.y.toFixed(2)+"m/s²";
  document.getElementById('acceleration-gravity-z').innerHTML = e.accelerationIncludingGravity.z.toFixed(2)+"m/s²";
  
  document.getElementById('rotation-alpha').innerHTML = e.rotationRate.alpha.toFixed(2)+"°/s";
  document.getElementById('rotation-beta').innerHTML = e.rotationRate.beta.toFixed(2)+"°/s";
  document.getElementById('rotation-gamma').innerHTML = e.rotationRate.gamma.toFixed(2)+"°/s";
});
