async function startFaceDetection() {
  if (!window.FaceDetector){
    alert("The Face Detector API is not available in your current browser");
    return;
  }
  window.faceDetectionVideo = document.getElementById("face-detection-video");
  window.faceDetectionFeatureCanvas = document.getElementById("face-detection-features");
  window.faceDetectorInstance = new FaceDetector();
  await initializeCameraStream();
  drawCurrentFrameOnCanvasAndDetectFaces();
}

async function drawCurrentFrameOnCanvasAndDetectFaces(){
  //we draw the video stream on a canvas
  let ctx = window.faceDetectionFeatureCanvas.getContext('2d');
  ctx.clearRect(0, 0, window.faceDetectionFeatureCanvas.width, window.faceDetectionFeatureCanvas.height);
  ctx.drawImage(window.faceDetectionVideo, 0, 0, window.faceDetectionFeatureCanvas.width, window.faceDetectionFeatureCanvas.height);
  let faces = await window.faceDetectionFeatureCanvas.detect(window.faceDetectionFeatureCanvas);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#6beeff";
  ctx.fillStyle = "lime";
  faces.forEach(face => {
    const { boundingBox, landmarks } = face;
    ctx.strokeRect(boundingBox.x, boundingBox.y,  boundingBox.width, boundingBox.height);
    (landmarks ?? []).forEach(landmark => {
      const points = landmark.locations ?? [];
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
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
