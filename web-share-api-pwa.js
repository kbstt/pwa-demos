function shareContent(){
  if (!navigator.share){
    alert("Your device does not support the Web Share API. Try on an iPhone or Android phone!");
  }
  else {
    let url = document.getElementById("content-url").value;
    let title = document.getElementById("content-title").value;
    let text = document.getElementById("content-text").value;
    let data = {url: url, text: text, title: title};
    console.log(data);
    navigator.share(data);
  }
} 
