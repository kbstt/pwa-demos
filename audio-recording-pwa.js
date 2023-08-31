async function recordAudio(){
  if (window.recorder && window.recorder.state === "recording"){
     window.recorder.stop();
  }
  else {
    let toggle = document.getElementById('recording-button');
    let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false });
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
      let blob = new Blob(chunks, { type: 'audio/mp3' });
      toggle.innerHTML = `<i class="fa fa-circle"></i>`;
      document.getElementById('audio-element').src = URL.createObjectURL(blob);
    };
  
    window.recorder.start();
  }
}

