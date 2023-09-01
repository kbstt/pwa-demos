async function recordScreen(){
   if (!navigator.mediaDevices.getDisplayMedia){
     alert("Your device does not support the Screen Capture API");
   }
   else {
     try {
       let toggle = document.getElementById("recording-button");
       let stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: false});
       let track = stream.getVideoTracks()[0];

       track.onended = () => {
           window.recorder.stop();
       };
        
       let chunks = [];
     
       window.recorder = new MediaRecorder(stream);
   
       window.recorder.ondataavailable = function(event){
         if (event.data.size <= 0) {return;}
         chunks.push(event.data);
       };
   
      window.recorder.onstop = function(){
         let blob = new Blob(chunks, { type: 'video/mp4' });
         toggle.classList.remove('disabled');
         document.getElementById('video-element').src = URL.createObjectURL(blob);
         let tracks = stream.getTracks();
         tracks.forEach(track => track.stop());
       };
   
       window.recorder.onstart = function(){
         toggle.classList.add('disabled');
       };
     
       window.recorder.start();
     }
     catch (err) {
       alert(err);
    }
  }
}
