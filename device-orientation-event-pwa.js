window.addEventListener("deviceorientation", function(e){
  document.getElementById('alpha').innerHTML = e.alpha+"°"; //angle of motion around the Z axis
  document.getElementById('beta').innerHTML = e.beta+"°"; //angle of motion around the X axis
  document.getElementById('gamma').innerHTML = e.gamma+"°"; //angle of motion around the Y axis
  document.getElementById('orientation').innerHTML = Math.abs(e.beta) > Math.abs(e.gamma) ? "landscape" : "portrait";
});
