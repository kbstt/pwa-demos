function startSpeechRecognition(){
  let recognition = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.start();
  recognition.addEventListener("result", function(e){
    console.log(e);
  });
}
