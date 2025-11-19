async function estimateStorageQuotas(){
  if (!navigator.storage || !navigator.storage.estimate){
    alert("Storage Quota API not supported");
    return;
  }
  let estimate = await navigator.storage.estimate();
  let percent = (estimate.usage * 100 / estimate.quota).toFixed(0);
  alert("usage: "+estimate.usage+", quota: "+estimate.quota +" ("+percent+"%)";
}
