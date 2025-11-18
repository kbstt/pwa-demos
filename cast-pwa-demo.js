async function startCasting(){
  if (!("presentation" in navigator)) {
    alert ("Presentation API not supported");
    return;
  } 
  try {
    const request = new PresentationRequest([window.location.origin+"/sample-cast-page"]);
    presentationConnection = await request.start();
  } 
  catch (err) {
      alert("Error starting presentation");
      console.error(err);
  }
}

function broadcastVideo(videoUrl){
  presentationConnection.send(videoUrl);
}
