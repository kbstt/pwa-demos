function synthesiseSpeech(){
  if (!window.speechSynthesis){
    alert("Your device does not support the SpeechSynthesis API");
  }
  else {
    let text = document.getElementById('text-to-read').value;
    let voices = speechSynthesis.getVoices();
    let voice = voices.find(o => o.voiceURI === document.getElementById('voice-choice').value) || voices[0];
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    speechSynthesis.speak(utterance);
  }
}
