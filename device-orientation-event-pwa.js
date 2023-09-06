async function getOrientation(){
  if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission){
    return alert("Your current device does not have access to the DeviceOrientation event");
  }

  let permission = await window.DeviceOrientationEvent.requestPermission();
  if (permission !== "granted"){
    return alert("You must grant access to the device's sensor for this demo");
  }
}

window.addEventListener("deviceorientation", function(e){
  document.querySelector("btn#get-motion").remove();
  document.getElementById('alpha').innerHTML = e.alpha.toFixed(1)+"°"; //angle of motion around the Z axis
  document.getElementById('beta').innerHTML = e.beta.toFixed(1)+"°"; //angle of motion around the X axis
  document.getElementById('gamma').innerHTML = e.gamma.toFixed(1)+"°"; //angle of motion around the Y axis
  document.getElementById('orientation').innerHTML = Math.abs(e.beta) > Math.abs(e.gamma) ? "portrait" : "landscape";  
});
