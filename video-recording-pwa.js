async function recordVideo(){
  if (window.recorder && window.recorder.state === "recording"){
     window.recorder.stop();
  }
  else {
    let toggle = document.getElementById('recording-button');
    let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
    window.recorder = new MediaRecorder(stream);

    let chunks = [];
    window.recorder.ondataavailable = function(event){
      if (event.data.size <= 0) {return;}
      chunks.push(event.data);
    };

    window.recorder.onstart = function(){
      toggle.innerHTML = `<i class="fa fa-square"></i>`;
    };
    
    window.recorder.onstop = function(){
      let blob = new Blob(chunks, { type: 'video/mp4' });
      toggle.innerHTML = `<i class="fa fa-circle"></i>`;
      document.getElementById('video-element').src = URL.createObjectURL(blob);
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };
  
    window.recorder.start();
  }
}
