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
      let context = canvas.getContext('2d');

     let detectFace = async function(){
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          new FaceDetector().detect(canvas);
          requestAnimationFrame(detectFace);
     };       
     detectFace();
  });
}
