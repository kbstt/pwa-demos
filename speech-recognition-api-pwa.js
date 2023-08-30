function toggleSpeechRecognition(){
  if (!window.webkitSpeechRecognition && ! window.SpeechRecognition){
    alert("Your browser does not support the SpeechRecognition API");
  }
  else if (window.transcriptionInProgress){
    window.transcriptionInProgress.stop();
  }
  else {
    window.transcriptionInProgress = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : new SpeechRecognition();
    window.transcriptionInProgress.lang = "en-US";
    window.transcriptionInProgress.interimResults = true;
    window.transcriptionInProgress.start();
    window.transcriptionInProgress.addEventListener("result", function(e){
      console.log(e);
    });
    window.transcriptionInProgress.addEventListener("speechend", function(e){
       window.transcriptionInProgress = null;
    });
  }
}
