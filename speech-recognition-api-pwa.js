function toggleSpeechRecognition(){
  if (!window.webkitSpeechRecognition && ! window.SpeechRecognition){
    alert("Your browser does not support the SpeechRecognition API");
  }
  else if (window.transcriptionInProgress){
    window.transcriptionInProgress.stop();
  }
  else {
    let btn = document.getElementById("transcribe-now");
    window.transcriptionInProgress = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : new SpeechRecognition();
    window.transcriptionInProgress.lang = "en-US";
    window.transcriptionInProgress.interimResults = true;
    window.transcriptionInProgress.addEventListener("result", function(e){
      document.getElementById("results").innerHTML = e.results[0][0].transcript;
    });
    window.transcriptionInProgress.addEventListener("end", function(e){
       window.transcriptionInProgress = null;
       btn.innerHTML = '<i class="fa fa-circle"></i>Start';
    });
    window.transcriptionInProgress.addEventListener("start", function(e){
       btn.innerHTML = '<i class="fa fa-square"></i>Stop';
    });
    window.transcriptionInProgress.start();
  }
}
