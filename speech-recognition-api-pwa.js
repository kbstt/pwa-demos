function toggleSpeechRecognition(){
  if (!window.webkitSpeechRecognition && ! window.SpeechRecognition){
    alert("Your browser does not support the SpeechRecognition API");
  }
  else if (window.transcriptionInProgress){
    window.transcriptionInProgress.stop();
  }
  else {
    let btn = document.getElementById("transcribe-now");
    let result = document.getElementById("results");
    window.transcriptionInProgress = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : new SpeechRecognition();
    window.transcriptionInProgress.lang = "en-US";
    window.transcriptionInProgress.interimResults = true;
    window.transcriptionInProgress.start();
    window.transcriptionInProgress.addEventListener("result", function(e){
      console.log(e);
      result.innerHTML = e.results[0][0].transcript;
    });
    window.transcriptionInProgress.addEventListener("speechend", function(e){
       window.transcriptionInProgress = null;
       btn.innerHTML = '<i class="feather feather-mic"></i>Start transcribing';
    });
    window.transcriptionInProgress.addEventListener("speechstart", function(e){
       btn.innerHTML = '<i class="feather feather-mic-off"></i>Stop transcribing';
    });
  }
}
