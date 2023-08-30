function startSpeechRecognition(){
  let recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
}
