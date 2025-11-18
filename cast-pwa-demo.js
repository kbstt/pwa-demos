async function setWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
    const request = new PresentationRequest(['casting.html']);
    presentationConnection = await request.start();
    presentationConnection.send(JSON.stringify({ type: "camera" }));
    const streamUrl = URL.createObjectURL(window.videoSrcElement.srcObject);
    presentationConnection.send(JSON.stringify({ type: "stream", url: streamUrl }));
  } 
  catch (err) {
      alert("Error starting presentation");
      console.error();
  }
}
