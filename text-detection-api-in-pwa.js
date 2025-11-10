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
    let img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();
    let container = document.getElementById("text-detector-result");
    container.innerHTML = "";
    container.appendChild(img);
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.position = "absolute";
    container.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    let detector = new TextDetector();
    let results = await detector.detect(img);
    let scaleX = img.width / img.naturalWidth;
    let scaleY = img.height / img.naturalHeight;
    results.forEach(result => {
        let box = result.boundingBox;
        ctx.strokeRect(box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
    });
}
