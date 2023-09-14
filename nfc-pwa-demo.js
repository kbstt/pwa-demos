async function connectToNFC() {
  if (!window.NDEFReader){
    return alert("Web NFC API is not supported in this browser.");
  }
    
  let reader = new NDEFReader();

  let btn = document.querySelector("#demo-btn button");
  btn.classList.add("disabled");
  btn.innerHTML = "Scanning...";
    
  reader.addEventListener("reading", function(message, serialNumber){    
    let tagData = message.records.map(record => record.toString()).join("\n");   
    document.querySelector("#tag-data").innerHTML = tagData;
  });
    
  await reader.scan();
}
