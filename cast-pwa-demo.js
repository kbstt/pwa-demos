async function startCasting(){
  if (!("presentation" in navigator)) {
    alert ("Presentation API not supported");
    return;
  } 
  if (window.presentationConnection){
    alert("You are already casting");
    return;
  }
  try {
    const request = new PresentationRequest([window.location.origin+"/sample-cast-page"]);
    presentationConnection = await request.start();
    presentationConnection.onterminate = () => { presentationConnection = null;}
  } 
  catch (err) {
      alert("Error starting presentation");
      alert(err);
      console.error(err);
  }
}

function stopCasting(){
  if (!window.presentationConnection){
    alert("You must cast first before you can stop casting");
    return;
  }
  presentationConnection.terminate();  
  presentationConnection = null;
}

function broadcastVideo(videoUrl){
  if (!window.presentationConnection){
    alert("You must cast first before playing videos");
    return;
  }
  presentationConnection.send(videoUrl);
}
