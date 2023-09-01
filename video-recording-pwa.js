async function recordVideo(){
  if (window.recorder && window.recorder.state === "recording"){
     window.recorder.stop();
  }
  else {
    let toggle = document.getElementById('recording-button');
    
    //we request permission to access the device's microphone and camera
    let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });

    //then we add that stream to our <video> element
    let videoEl = document.getElementById('video-element');
    videoEl.srcObject = stream;
    videoEl.play();

    //next, we need to actively record that stream
    window.recorder = new MediaRecorder(stream);

    //whenever new data has been recorded, we add it to an array of chunks
    let chunks = [];
    window.recorder.ondataavailable = function(event){
      if (event.data.size <= 0) {return;}
      chunks.push(event.data);
    };

    window.recorder.onstop = function(){
      
      //when the recording is over, we take all these chunks of video/audio, then create a blob with it
      //see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
      let blob = new Blob(chunks, { type: 'video/mp4' });

      //we change our "stop" button back to a "record" button
      toggle.innerHTML = `<i class="fa fa-circle"></i>`;
      
      //we replace the source of the video object by removing the stream we added to it earlier
      //and instead we use the URL of the blob we just created with all the recorded chunks -- this will allow our <video> element to play our recorded video
      videoEl.srcObject = null;
      videoEl.src = URL.createObjectURL(blob);

      //last but not least, we tell the browser we don't need access to the user's camera and microphone anymore
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };

    //below is just a helper function to change the record button to a stop button
    window.recorder.onstart = function(){
      toggle.innerHTML = `<i class="fa fa-square"></i>`;
    };
  
    window.recorder.start();
  }
}
