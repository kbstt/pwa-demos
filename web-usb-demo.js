async function connectToUSBDevice(){
  if (!navigator.usb){
    alert("The WebUSB API is not supported in your browser");
    return;
  }
  try {
    let log = document.getElementById('usb-log');
    let device = await navigator.usb.requestDevice({ filters: [{}] });
    await device.open();
    log.textContent +=  "Device opened: \n";
    log.textContent +=  "Manufacturer: "+device.manufacturerName + "\n";
    log.textContent +=  "Product: "+device.productName + "\n";
    log.textContent +=  "Serial Number: "+device.device.serialNumber + "\n";
  } 
  catch (err) {
    console.error("Error:", err);
  }
}
