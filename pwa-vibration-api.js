let patterns = [
  2000,
  [1000, 500, 1000, 500, 1000],
  [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
];

function vibrationPattern(index){
  console.log(index);
  if (!window.navigator.vibrate){
    alert("Your device does not support the Vibration API. Try on an Android phone!");
  }
  else {
    console.log(patterns[index]);
    window.navigator.vibrate(patterns[index]);
  }
}
