async function startCasting(){
  if (!("presentation" in navigator)) {
    alert ("Presentation API not supported");
    return;
  } 
  try {
    const request = new PresentationRequest(["http://127.0.0.1:5000/features/push-notifications"]);
    presentationConnection = await request.start();
  } 
  catch (err) {
      alert("Error starting presentation");
      console.error(err);
  }
}
