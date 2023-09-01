async function recordScreen(){
   if (!navigator.mediaDevices.getDisplayMedia){
     alert("Your device does not support the Screen Capture API");
   }
   else {
        try {
          let toggle = document.getElementById("recording-button");

          //we ask the user for permission to share their screen with our app
          let stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: false});
          let track = stream.getVideoTracks()[0];

          //when users stop sharing, the event below will be fired
          track.onended = () => {
              window.recorder.stop();
          };

          //we record the stream from the screen-sharing
          window.recorder = new MediaRecorder(stream);

          //whenever our MediaRecorder receives data, we save it in a variable
          let chunks = [];
          window.recorder.ondataavailable = function(event){
            if (event.data.size <= 0) {return;}
            chunks.push(event.data);
          };

         //when the screen sharing is over, we turn our chunks into a blob, 
         //then create a object URL to add to our <video> element, 
         //allowing instant playback of our screen recording
         window.recorder.onstop = function(){
            let blob = new Blob(chunks, { type: 'video/mp4' });
            toggle.classList.remove('disabled');
            document.getElementById('video-element').src = URL.createObjectURL(blob);
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          };

         //stop the screen sharing typically happens in another browser tab or window
         //so it's not very necessary to update the status of our "start recording" button, 
         //besides disabling it while the screen is being recorded
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
