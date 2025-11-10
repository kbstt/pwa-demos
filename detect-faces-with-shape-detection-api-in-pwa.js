async function startFaceDetection() {
  if (!window.FaceDetector){
    alert("The Face Detector API is not available in your current browser");
    return;
  }
  
  let video = document.getElementById('face-detection-video');
  let stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}});
  video.srcObject = stream;
  video.play();
  video.addEventListener('loadedmetadata', async function(){
      let canvas = document.getElementById('face-detection-canvas');
      let ctx = canvas.getContext('2d');
      let faceDetector = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });

      async function detectFaces() {
        try {
          let faces = await faceDetector.detect(canvas);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'lime';
          ctx.fillStyle = 'red';
    
          for (const face of faces) {
            let { boundingBox, landmarks } = face;
            ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            if (landmarks) {
              for (let landmark of landmarks) {
                let { locations } = landmark;
                if (locations) {
                  for (let point of locations) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                    ctx.fill();
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error('Face detection failed:', err);
        }
        requestAnimationFrame(detectFaces);
      }

    detectFaces();
  });
}
