function calculateDeviceMemory(){
  let memory = navigator.deviceMemory ? (navigator.deviceMemory+" GB") : "unknown";
  let container = document.getElementById('device-memory');
  container.innerHTML = memory;
}
