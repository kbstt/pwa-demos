window.addEventListener("online", function(){
  alert("You are back online!");
  document.getElementById("network-status").innerHTML = "navigator.onLine: true";
  
});

window.addEventListener("offline", function(){
  alert("You are now offline!");
  document.getElementById("network-status").innerHTML = "navigator.onLine: false";
});
