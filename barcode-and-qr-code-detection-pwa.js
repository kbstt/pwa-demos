async function startBarcodeScanner() {
     //we start the device's camera
     let video = document.getElementById('barcode-detection-video');
     let stream = await navigator.mediaDevices.getUserMedia({ video: true });
     video.srcObject = stream;
     video.play();

     //for the purpose of this demo, we're only detecting QR codes, but there are plenty of other barcodes formats we could detect
     //see https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats
     let barcodeDetector = new BarcodeDetector({formats: ["aztec"] });

     video.addEventListener('loadedmetadata', async function(){
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let context = canvas.getContext('2d');

        let checkForQrCode = async function(){
            //we draw the current view from the camera on a canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            //then we pass that canvas to the barcode detector
            let barcodes = await barcodeDetector.detect(canvas);
                        
            if (barcodes.length > 0) {
                let barcodeData = barcodes[0].rawValue;
                alert("Detected the following URL: "+barcodeData); 
            };
          
           requestAnimationFrame(checkForQrCode);
        };
       
        checkForQrCode();
    });
}
