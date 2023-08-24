function getNetworkInformation(){
  let data = navigator.connection;
  alert("downLink:"+data.downLink +"\n effectiveType: "+data.effectiveType)
}
