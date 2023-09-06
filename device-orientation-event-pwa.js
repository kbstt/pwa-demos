window.addEventListener("deviceorientation", function(e){
  let alpha = e.alpha; //angle of motion around the Z axis
  let beta = e.beta; //angle of motion around the X axis
  let gamma = e.gamma; //angle of motion around the Y axis 
  console.log(alpha+" "+beta+" "+gamma);
});
