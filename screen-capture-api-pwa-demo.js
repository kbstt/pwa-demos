async function recordScreen(){
 try {
    if (!navigator.mediaDevices.getDisplayMedia){return alert("Your device does not support the Screen Capture API");}

    let toggle = document.getElementById("recording-button");
    let stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: false});
    let chunks = [];
  
    window.recorder = new MediaRecorder(stream);

    window.recorder.ondataavailable = function(event){
      if (event.data.size <= 0) {return;}
      chunks.push(event.data);
    };

   window.recorder.onstop = function(){
      let blob = new Blob(chunks, { type: 'video/mp4' });
      toggle.innerHTML = `<i class="fa fa-circle"></i>`;
      videoEl.srcObject = null;
      document.getElementById('video-element').src = URL.createObjectURL(blob);
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };

    window.recorder.onstart = function(){
      toggle.innerHTML = `<i class="fa fa-square"></i>`;
    };
  
    window.recorder.start();
  } 
 catch (err) {
    console.log(err);
  }
}
