async function setWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const video = document.getElementById("pip-demo-feed");
    video.srcObject = stream;
  } 
  catch (err) {
     console.error(err);
  }
}

async function startPiP() {
  const video = document.getElementById("pip-demo-feed");
  if (!document.pictureInPictureEnabled) {
      alert("Picture-in-Picture is not supported in this browser.");
      return;
  }
  
  try {
    if (!document.pictureInPictureElement) {
        await video.requestPictureInPicture();
    } 
    else {
       await document.exitPictureInPicture();
    }
  }
  catch (err) {
     console.error(err);
  }
}
