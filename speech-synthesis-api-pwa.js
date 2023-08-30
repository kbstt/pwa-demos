function synthesiseSpeech(){
  if (!window.speechSynthesis){
    alert("Your device does not support the SpeechSynthesis API");
  }
  else {
    let text = document.getElementById('text-to-read').value;
    let voices = speechSynthesis.getVoices();
    let voice = voices.find(o => o.voiceURI === document.getElementById('voice-choice').value) || voices[0];
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.pitch = document.getElementById('pitch').value;
    utterance.rate = document.getElementById('rate').value;
    speechSynthesis.speak(utterance);
  }
}
