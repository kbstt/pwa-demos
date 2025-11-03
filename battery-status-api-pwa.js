async function getBatteryLevel(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  alert("Your device has "+(battery.level * 100)+"% battery left");
  logBatteryObject();
}

async function isTheDeviceCharging(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  alert("Your device is charging: "+battery.charging);
  logBatteryObject();
}

async function timeLeftToFullCharge(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  if (!battery.charging){
    alert ("Your device is not currently charging");
  }
  else {
    let timeLeft = battery.chargingTime/60 + " min";
    if (battery.chargingTime === "Infinity"){
       timeLeft = "unknown";
    }
    alert("Time left to full charge: "+timeLeft);
  }
  logBatteryObject();
}

async function timeLeftToEmptyBattery(){
  if (!batteryAPISupported()){return;}
  let battery = await navigator.getBattery();
  if (battery.charging){
    alert ("Your device is currently charging");
  }
  else {
    let timeLeft = battery.dischargingTime/60 + " min";
    if (battery.dischargingTime === "Infinity"){ 
       timeLeft = "unknown"; 
    }
    alert("Time left to empty battery: "+timeLeft);
  }
  logBatteryObject();
}

async function logBatteryObject(){
  let container = document.getElementById("battery-json");
  if (navigator.getBattery){
    let battery = await navigator.getBattery();
    container.innerHTML = `
       charging: `+battery.charging+`,<br>
       level: `+battery.level+`,<br>
       dischargingTime: `+battery.dischargingTime+`<br>
       chargingTime: `+battery.chargingTime+`<br>
    `;
  }
  else {
    container.innerHTML = "Your current browser does not support the Battery API";
  }  
}

function batteryAPISupported(){
  if (!navigator.getBattery){
    alert("You current browser does not support the Battery API");
    return false;
  }
  return true;
}

async function monitorBatteryStatus(){
  let battery = await navigator.getBattery();
  logBatteryObject();
  battery.addEventListener('levelchange', logBatteryObject);
  battery.addEventListener('chargingchange', logBatteryObject);
  battery.addEventListener('chargingtimechange', logBatteryObject);
  battery.addEventListener('dischargingtimechange', logBatteryObject);
}

setTimeout(monitorBatteryStatus, 600);
