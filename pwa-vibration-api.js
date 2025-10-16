let patterns = [
  2000, //vibrate one time for 2 seconds
  [2000, 1000, 2000, 1000, 2000, 1000, 2000],
  [400, 200, 400, 200, 400, 200, 800, 200, 800, 200, 400, 200, 400, 200, 200, 200], //vibrate "Twinkle, Twinkle, Little Star"
  [150, 50, 150, 50, 300, 100, 150, 50, 150, 50, 300, 100, 150, 50, 150, 50], //vibrate "Super Mario Bros" theme
  [300, 200, 300, 200, 300, 400, 300, 200, 300, 200, 300, 400, 300, 200, 600, 200] //vibrate "Jingle Bells"
];

function vibrationPattern(index){
  if (navigator.vibrate){
    navigator.vibrate(patterns[index]);
  }
  /*iOS fallback: WebKit browsers do not support the Vibration API
  However, you can trigger a light haptic feedback by associating
  a label to a switch input and toggling it programmatically */
  else {
      let id = Math.random().toString(36).slice(2);
	  let el = document.createElement('div');
	  el.innerHTML = `<input type="checkbox" id="`+id+`" switch /><label for="`+id+`"></label>`;
	  el.setAttribute("style", "display:none !important;opacity:0 !important;visibility:hidden !important;");
	  document.querySelector('body').appendChild(el);
	  el.querySelector('label').click();
	  setTimeout(function(){ el.remove(); }, 1500);
  }
}
