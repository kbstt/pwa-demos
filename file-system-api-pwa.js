async function chooseAFile() {
  if (!window.showOpenFilePicker){
      alert("Your current device does not support the File System API. Try again on desktop Chrome!");
  }
  else {
    //here you specify the type of files you want to allow
    let options = {
      types: [{
        description: "Images", 
        accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg", ".svg"],
            "text/*": [".txt", ".json"],
            "application/*": [".json"],
        },
      }],
      excludeAcceptAllOption: true,
      multiple: false,
    };
    
    // Open file picker and choose a file
    let fileHandle = await window.showOpenFilePicker(options);
    if (!fileHandle[0]){return;}
    
    // get the content of the file
    let file = await fileHandle[0].getFile();
    previewFile(file);
  }
}

function previewFile(file){
  let previewContainer = document.getElementById("file-preview-container");
  previewContainer.innerHTML = "";
  
  if (file.type.startsWith("image/")) {
      let imgPreview = document.createElement("img");
      imgPreview.src = URL.createObjectURL(file);
      previewContainer.appendChild(imgPreview);
  } 
  else if (file.type.startsWith("text/") || file.type.startsWith("application/")) {
      let reader = new FileReader();
      reader.onload = function(event) {
        let textPreview = document.createElement("div");
        textPreview.textContent = event.target.result;
        previewContainer.appendChild(textPreview);
      };
      reader.readAsText(file);
  } 
  else {
      alert("This demo does not support this specific type of file, but your own implementation could!");
  }
}
