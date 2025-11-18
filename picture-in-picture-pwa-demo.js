async function setWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const video = document.getElementById("pip-demo-feed");
    video.srcObject = stream;
  } 
  catch (err) {
     alert("Couldn't access your camera");
  }
}

async function startPiP() {
  const video = document.getElementById("pip-demo-feed");
  if (!document.pictureInPictureEnabled) {
      alert("Picture-in-Picture not supported in this browser.");
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
     alert("Error enabling picture-in-picture");
  }
}
