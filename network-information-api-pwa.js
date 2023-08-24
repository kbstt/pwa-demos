function getNetworkInformation(){
  if (!navigator.connection){
    alert("Your device does not support the NetworkInformation API");
  }
  else {
    let data = navigator.connection;
    alert("downlink:"+data.downlink +"\n"+
      "effectiveType: "+data.effectiveType+"\n"+
      "rtt: "+data.rtt+"\n"+
      "saveData: "+data.saveData+"\n"+
      "downlinkMax: "+data.downlinkMax+"\n"+
      "type: "+data.type+"\n"
    )
  }
}
