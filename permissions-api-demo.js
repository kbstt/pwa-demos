async function printPermission(permissionName, descriptor) {
    try {
      let permission = await navigator.permissions.query(Object.assign({name: permissionName}, descriptor));
      document.getElementById(permissionName+"-p").innerHTML = permission.state;
    } catch (error) {
       console.log(error);
    }
}

function queryPermissions(){
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
