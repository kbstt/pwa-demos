function startSpeechRecognition(){
  let recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.start();
  recognition.addEventListener("result", function(e){
    console.log(e);
  });
}
