function getNetworkInformation(){
  let data = navigator.connection;
  alert("downLink:"+data.downLink +"\n"+
    "effectiveType: "+data.effectiveType+"\n"+
    "downlinkMax: "+data.downlinkMax+"\n"+
    "rtt: "+data.rtt+"\n"+
    "saveData: "+data.saveData+"\n"+
    "type: "+data.type+"\n"
  )
}
