async function chooseAFile() {
  //here you specify the type of files you want to allow
  let options = {
    types: [{
      description: "Images", 
      accept: {
          "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          "text/*": [".txt", ".json"],
          "application/*": [".json"],
      },
    }],
    excludeAcceptAllOption: true,
    multiple: false,
  };
  
  // Open file picker and choos ea file
  let fileHandle = await window.showOpenFilePicker(options);
  console.log(fileHandle);
  
  // get the content of the file
  let file = await fileHandle[0].getFile();
  console.log(file); 
}

function renderFile(){
   console.log(file)
}
