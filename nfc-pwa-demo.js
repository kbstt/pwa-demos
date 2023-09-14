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
    let btn = document.querySelector("#demo-btn button");
    btn.classList.add("disabled");
    btn.innerHTML = "Scanning";
    
    let tagData = message.records.map(record => record.toString()).join("\n");   
    document.querySelector("#tag-data").innerHTML = tagData;
  });
    
  await reader.scan();
}
