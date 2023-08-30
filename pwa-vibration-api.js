let patterns = [
  2000,
  [100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100],
  [1000, 500, 1000, 500, 1000],
  [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
];

function vibrationPattern(index){
  if (!window.navigator.vibrate){
    alert("Your device does not support the Vibration API. Try on an Android phone!");
  }
  else {
    window.navigator.vibrate(patterns[index]);
  }
}
