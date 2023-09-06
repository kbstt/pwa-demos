window.addEventListener("deviceorientation", function(e){
  document.getElementById('acceleration-x').innerHTML = e.acceleration.x+"m/s²";
  document.getElementById('acceleration-y').innerHTML = e.acceleration.y+"m/s²";
  document.getElementById('acceleration-z').innerHTML = e.acceleration.z+"m/s²";

  document.getElementById('acceleration-gravity-x').innerHTML = e.accelerationIncludingGravity.x+"m/s²";
  document.getElementById('acceleration-gravity-y').innerHTML = e.accelerationIncludingGravity.y+"m/s²";
  document.getElementById('acceleration-gravity-z').innerHTML = e.accelerationIncludingGravity.z+"m/s²";

  document.getElementById('rotation-alpha').innerHTML = e.rotationRate.alpha+"°/s";
  document.getElementById('rotation-beta').innerHTML = e.rotationRate.beta+"°/s";
  document.getElementById('rotation-gamma').innerHTML = e.rotationRate.gamma+"°/s";
});
