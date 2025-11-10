async function uploadImageToDetectText(){
   if (!window.TextDetector) {
        alert('TextDetector API not supported in this browser.');
        return;
    }
    let file = await new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => resolve(input.files);
        input.click();
    });
    if (!file) {return};
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();
    const detector = new TextDetector();
    const results = await detector.detect(img);
    results.forEach(result => console.log(result.rawValue));
}
