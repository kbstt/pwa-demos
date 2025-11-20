function deviceOnlyHasKeyboard(){
  return window.matchMedia('(pointer: none)').matches;
}

function deviceHasTouchscreen(){
  return window.matchMedia('(pointer: coarse)').matches;
}

function deviceHasMouse(){
  return window.matchMedia('(pointer: fine)').matches;
}
