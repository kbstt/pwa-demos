let patterns = [
  [200,100,200],
  [500],
  [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
];

vibrationPattern(index){
  if (!window.navigator.vibrate){
    alert("Your device does not support the Vibration API. Try on an Android phone!");
  }
  else {
    window.navigator.vibrate(patterns[index]);
  }
}
