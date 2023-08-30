function synthesiseSpeech(){
  if (window.speechSynthesis){
    alert("Your device does not support the SpeechSynthesis API");
  }
  else {
    let text = document.getElementById('text-to-read').value;
    let voices = speechSynthesis.getVoices();
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = "Trinoids";
    speechSynthesis.speak(utterance);
  }
}
