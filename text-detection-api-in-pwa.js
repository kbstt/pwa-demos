async function uploadImageToDetectText(){
   if (!window.TextDetector) {
        alert('TextDetector API not supported in this browser.');
        return;
   }
   let file = await new Promise(resolve => {
       let fileInput = document.createElement('input');
       fileInput.type = 'file';
       fileInput.accept = 'image/*';
       fileInput.onchange = () => resolve(fileInput.files[0]);
       fileInput.click();
    });
    if (!file) {return};
    const img = new Image();
    img.src = URL.createObjectURL(file);
    let container = document.getElementById("text-detector-result");
    container.innerHTML = "";
    container.appendChild(img);
    await img.decode();
    const detector = new TextDetector();
    const results = await detector.detect(img);
    console.log(results);
}
