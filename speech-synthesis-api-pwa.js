function synthesiseSpeech(){
  if (!window.speechSynthesis){
    alert("Your device does not support the SpeechSynthesis API");
  }
  else {
    let availableVoices = speechSynthesis.getVoices();
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = document.getElementById('text-to-read').value;
    utterance.voice = availableVoices.find(o => o.voiceURI === document.getElementById('voice-choice').value) || availableVoices[0];
    utterance.pitch = document.getElementById('pitch').value;
    utterance.rate = document.getElementById('rate').value;
    speechSynthesis.speak(utterance);
  }
}
