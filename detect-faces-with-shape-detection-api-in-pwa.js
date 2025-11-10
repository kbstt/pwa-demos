async function startFaceDetection() {
  if (!window.FaceDetector){
    alert("The Face Detector API is not available in your current browser");
    return;
  }
  window.faceDetectionVideo = document.getElementById("face-detection-video");
  window.faceDetectionCanvas = document.getElementById("face-detection-canvas");
  window.faceDetectionFeatureCanvas = document.getElementById("face-detection-features");
  window.faceDetectorInstance = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
  await initializeCameraStream();
  drawCurrentFrameOnCanvasAndDetectFaces();
}

async function drawCurrentFrameOnCanvasAndDetectFaces(){
  let ctx0 = window.faceDetectionCanvas.getContext('2d');
  ctx0.drawImage(window.faceDetectionVideo, 0, 0, window.faceDetectionCanvas.width, window.faceDetectionCanvas.height);
  let faces = await window.faceDetectorInstance.detect(window.faceDetectionCanvas);

  let ctx = window.faceDetectionFeatureCanvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'lime';
  ctx.fillStyle = 'red';
  faces.forEach(function(face){
    const { boundingBox, landmarks } = face;
    const scaleX = window.faceDetectionCanvas.width / window.faceDetectionVideo.videoWidth;
    const scaleY = window.faceDetectionCanvas.height / window.faceDetectionVideo.videoHeight;
    console.log(scaleX, scaleY);
    ctx.strokeRect(boundingBox.x * scaleX, boundingBox.y * scaleY, boundingBox.width * scaleX, boundingBox.height * scaleY);
    const points = (landmarks ?? []).flatMap(landmark => landmark.locations ?? []);
    console.log(points);
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x * scaleX, point.y * scaleY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  });
  requestAnimationFrame(drawCurrentFrameOnCanvasAndDetectFaces);
};

function initializeCameraStream(){
  return new Promise(async function(resolve, reject){  
     try {
      let stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}});
      window.faceDetectionVideo.srcObject = stream;
      window.faceDetectionVideo.play();
      window.faceDetectionVideo.addEventListener('loadedmetadata', function(){
        return resolve();
      });
    }
    catch(err){
      alert(err);
      reject(err);
    }
  })
};
