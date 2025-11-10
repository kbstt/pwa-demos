async function startFaceDetection() {
  if (!window.FaceDetector){
    alert("The Face Detector API is not available in your current browser");
    return;
  }
  window.faceDetectionVideo = document.getElementById("face-detection-video");
  window.faceDetectionCanvas = document.getElementById("face-detection-canvas");
  window.faceDetectorInstance = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
  await initializeCameraStream();
  drawCurrentFrameOnCanvasAndDetectFaces();
}

async function drawCurrentFrameOnCanvasAndDetectFaces(){
  let ctx = window.faceDetectionCanvas.getContext('2d');
  ctx.drawImage(window.faceDetectionVideo, 0, 0, window.faceDetectionCanvas.width, window.faceDetectionCanvas.height);
  let faces = await window.faceDetectorInstance.detect(window.faceDetectionCanvas);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'lime';
  ctx.fillStyle = 'red';
  faces.forEach(function(face){
    console.log(face);
    const { boundingBox, landmarks } = face;
    ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
    const points = (landmarks ?? []).flatMap(landmark => landmark.locations ?? []);
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
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
