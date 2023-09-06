window.addEventListener("deviceorientation", function(e){
  document.getElementById('acceleration-x').innerHTML = e.acceleration.x.toFixed(1)+"m/s²";
  document.getElementById('acceleration-y').innerHTML = e.acceleration.y.toFixed(1)+"m/s²";
  document.getElementById('acceleration-z').innerHTML = e.acceleration.z.toFixed(1)+"m/s²";

  document.getElementById('acceleration-gravity-x').innerHTML = e.accelerationIncludingGravity.x.toFixed(1)+"m/s²";
  document.getElementById('acceleration-gravity-y').innerHTML = e.accelerationIncludingGravity.y.toFixed(1)+"m/s²";
  document.getElementById('acceleration-gravity-z').innerHTML = e.accelerationIncludingGravity.z.toFixed(1)+"m/s²";

  document.getElementById('rotation-alpha').innerHTML = e.rotationRate.alpha.toFixed(1)+"°/s";
  document.getElementById('rotation-beta').innerHTML = e.rotationRate.beta.toFixed(1)+"°/s";
  document.getElementById('rotation-gamma').innerHTML = e.rotationRate.gamma.toFixed(1)+"°/s";
});
