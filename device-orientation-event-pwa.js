window.addEventListener("deviceorientation", function(e){
  document.getElementById('alpha').innerHTML = (e.alpha).toFixed(2)+"°"; //angle of motion around the Z axis
  document.getElementById('beta').innerHTML = (e.beta).toFixed(2)+"°"; //angle of motion around the X axis
  document.getElementById('gamma').innerHTML = (e.gamma).toFixed(2)+"°"; //angle of motion around the Y axis
  document.getElementById('orientation').innerHTML = Math.abs(e.beta) > Math.abs(e.gamma) ? "portrait" : "landscape";
});
