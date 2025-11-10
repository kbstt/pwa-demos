let memory = (navigator.deviceMemory +"GB") || "unknown";
let container = document.getElementById('device-memory')
container.innerHTML = memory;
