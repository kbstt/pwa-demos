async function connectToBluetoothDevice(){
  if (!navigator.bluetooth || !navigator.bluetooth.requestDevice){
    alert("Your device does not support the Web Bluetooth API. Try again on Chrome on Desktop or Android!");
  }
  else {
    //in this example, we'll simply allow connecting to any device nearby
    //in a real-life example, you'll probably want to use filter so that your app only connects to certain types of devices (e.g. a heart rate monitor)
    //more on this here: https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
    let device = await navigator.bluetooth.requestDevice({acceptAllDevices: true});
    alert("Successfully connected to "+device.name);
  }
}
