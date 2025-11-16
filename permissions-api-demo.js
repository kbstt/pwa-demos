async function printPermission(permissionName, descriptor) {
    try {
      let permission = await navigator.permissions.query(Object.assign({name: permissionName}, descriptor));
      let result = document.createElement("tr");
      result.innerHTML = "<td>"+permissionName+"</td><td>"+permission.state+"</td>";
      window.permissionResultContainer.appendChild(result);
    } catch (error) {
       console.log(error);
    }
}

function queryPermissions(){
  window.permissionResultContainer = document.getElementById("permission-results");
  printPermission("geolocation");
  printPermission("notifications");
  printPermission("push", {userVisibleOnly: true});
  printPermission("midi", {sysex: true});
  printPermission("camera");
  printPermission("microphone");
  printPermission("background-sync");
  printPermission("ambient-light-sensor");
  printPermission("accelerometer");
  printPermission("gyroscope");
  printPermission("magnetometer");
}
