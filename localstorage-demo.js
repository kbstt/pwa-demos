function renderFilePreview(base64Data){
  console.log(base64Data);
  let previewContainer = document.getElementById("file-preview-container");
  previewContainer.innerHTML = "";
  let imgPreview = document.createElement("img");
  imgPreview.src = base64Data;
  previewContainer.appendChild(imgPreview);
}

function processFileSelection(event){
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
  document.getElementById('upload-file').addEventListener('change', processFileSelection);
  let base64Data = localStorage.getItem('uploadedFile');
  if (!base64Data){return;}
  renderFilePreview(base64Data);
}
