function renderFilePreview(base64Data){
  let previewContainer = document.getElementById("file-preview-container");
  previewContainer.innerHTML = "";
  let imgPreview = document.createElement("img");
  imgPreview.src = base64Data;
  previewContainer.appendChild(imgPreview);
}

function processFileSelection(event){
  //we save the file selected in base64 format
  let file = event.target.files[0];
  if (!file) {return alert('No file selected');}
  let reader = new FileReader();
  reader.onload = function(e) {
    let base64Data = e.target.result;
    renderFilePreview(base64Data);
    localStorage.setItem('uploadedFile', base64Data);
  };
  reader.readAsDataURL(file);
}

async function initializePage(){
  //we add the file picker functionality to the input file we have on the page
  document.getElementById('upload-file').addEventListener('change', processFileSelection);

  //if we have a file uploaded from a previous session, 
  //we get it from localStorage and render it on the page
  let base64Data = localStorage.getItem('uploadedFile');
  if (!base64Data){return;}
  renderFilePreview(base64Data);
}
