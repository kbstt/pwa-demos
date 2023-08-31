async function startRecording(){
  try {
    let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false });
    let audioElement = document.getElementById('audio-element');
    audioElement.src = stream;
  }
  catch(err){
    console.log(err);
  }
}

