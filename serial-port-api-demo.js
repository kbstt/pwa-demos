async function connectSerial() {
  if (!navigator.serial) {
    alert('Web Serial API not supported.');
    return;
  }
  const log = document.getElementById('serial-port-log');
    
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
    const reader = inputStream.getReader();
    
    while (true) {
      const { value, done } = await reader.read();
      if (value) {
        log.textContent += value + '\n';
      }
      if (done) {
        console.log('[readLoop] DONE', done);
        reader.releaseLock();
        break;
      }
    }  
  } catch (error) {
    log.innerHTML = error;
  }
}
