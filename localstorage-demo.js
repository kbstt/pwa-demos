function onChange(event){
  let file = event.target.files[0];
  if (!file) {return alert('No file selected');}
  let reader = new FileReader();
  reader.onload = function(e) {
    let base64Data = e.target.result;
    localStorage.setItem('uploadedFile', base64Data);
  };
  reader.readAsDataURL(file);
}

async function initializePage(){
  document.getElementById('upload-file').addEventListener('change', onChange);
  let file = localStorage.getItem('uploadedFile');
  if (!file){return;}
  
}
