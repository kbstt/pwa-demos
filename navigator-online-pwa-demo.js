window.addEventListener("online", function(){
  alert("You are back online!");
  document.getElementById("network-status").innerHTML = "navigatorOnline: true";
});

window.addEventListener("offline", function(){
  alert("You are now offline!");
  document.getElementById("network-status").innerHTML = "navigatorOnline: false";
});
