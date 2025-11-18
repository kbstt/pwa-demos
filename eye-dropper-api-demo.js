async function openEyeDropper(){
  const eyeDropper = new EyeDropper()
  let color = await eyeDropper.open();
  let hex = color.sRGBHex;
  document.getElementById("color-input").value = hex;
  document.getElementById("color-hex").innerHTML = hex;
}
