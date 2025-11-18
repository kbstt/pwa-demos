async function setWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
    window.videoSrcElement = document.getElementById("cast-demo-feed");
    window.videoSrcElement.srcObject = stream;
  } 
  catch (err) {
     alert("Couldn't access your camera");
  }
}

async function startCasting(){
  if (!("presentation" in navigator)) {
    alert ("Presentation API not supported");
    return;
  }

  if (!window.videoSrcElement || !window.videoSrcElement.srcObject){
    alert("You must start your camera first");
  }

  try {
    const streamUrl = URL.createObjectURL(window.videoSrcElement.srcObject);
    const request = new PresentationRequest([streamUrl]);
    presentationConnection = await request.start();
    presentationConnection.send(JSON.stringify({ type: "camera" }));
    presentationConnection.send(JSON.stringify({ type: "stream", url: streamUrl }));
  } 
  catch (err) {
      alert("Error starting presentation");
      alert(err);
      console.error();
  }
}
