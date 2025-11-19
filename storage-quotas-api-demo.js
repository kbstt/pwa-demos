async function estimateStorageQuotas() {
  if (!navigator.storage || !navigator.storage.estimate) {
    alert("Storage Quota API not supported");
    return;
  }

  var estimate = await navigator.storage.estimate();
  var usageMB = (estimate.usage / (1024 * 1024)).toFixed(2);
  var quotaMB = (estimate.quota / (1024 * 1024)).toFixed(2);
  var percent = ((estimate.usage / estimate.quota) * 100).toFixed(1);

  var message = 
    "Usage: " + usageMB + " MB\n" +
    "Quota: " + quotaMB + " MB\n" +
    "Used: " + percent + "%";

  alert(message);
}
