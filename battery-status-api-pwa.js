async function getBatteryLevel(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  alert("Your device has "+(battery.level * 100)+"% battery left");
}

async function isTheDeviceInCharge(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  alert("Your device is charging: "+battery.charging);
}

async function timeLeftToFullCharge(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  if (!battery.charging){
    alert ("Your device is not currently charging");
  }
  else {
    alert("Time left to full charge: "+(battery.chargingTime/60) + "min");
  }
}

async function timeLeftToEmptyBattery(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  if (battery.charging){
    alert ("Your device is currently charging");
  }
  else {
    alert("Time left to empty battery: "+(battery.dischargingTime/60) + "min");
  }
}

function batteryAPISupported(){
  if (!navigator.getBattery){
    alert('You current browser does not support the Battery API');
    return false;
  }
  return true;
}
