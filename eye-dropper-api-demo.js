async function openEyeDropper(){
  if (!window.EyeDropper){
    alert("Your browser does not support the EyeDropper API");
    return;
  }
  const eyeDropper = new EyeDropper()
  let color = await eyeDropper.open();
  let hex = color.sRGBHex;
  document.getElementById("color-input").value = hex;
  document.getElementById("color-hex").innerHTML = hex;
}
