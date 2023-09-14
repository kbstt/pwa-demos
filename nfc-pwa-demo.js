async function connectToNFC() {
  if (!window.NDEFReader){
    alert("Web NFC API is not supported in this browser.");
  }

  let nfcPermission = await navigator.permissions.query({name: "nfc"});
    
  if (nfcPermission.state !== "granted") {
    alert("NFC permission not granted");
  }
    
  let reader = new NDEFReader();
    
  reader.addEventListener("reading", function(message, serialNumber){
    let tagData = message.records.map(record => record.toString()).join("\n");
    console.log(tagData);
  });
    
  await reader.scan();
}


