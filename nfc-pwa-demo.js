async function connectToNFC() {
  if (!window.NDEFReader){
    return alert("Web NFC API is not supported in this browser.");
  }
    
  let reader = new NDEFReader();

  let btn = document.querySelector("#demo-btn button");
  btn.classList.add("disabled");
  btn.innerHTML = "Scanning...";
    
  let container = document.querySelector("#tag-data");
  
  let scan = await reader.scan();
  scan.onreadingerror = function(event){
      container.innerHTML = "Error! Cannot read data from the NFC tag. Try a different one?";
  };
  scan.onreading = function(event){
     container.innerHTML = JSON.stringify(event);
  };
}
