window.PermissionsList = [
  "accelerometer",
  "ambient-light-sensor",
  "background-sync",
  "bluetooth",
  "camera",
  "clipboard",
  "clipboard-read",
  "clipboard-write",
  "geolocation",
  "gyroscope",
  "hid",
  "magnetometer",
  "microphone",
  "midi",
  "nfc",
  "notifications",
  "payment-handler",
  "periodic-background-sync",
  "persistent-storage",
  "push",
  "serial",
  "speaker-selection",
  "usb"
];

async function getPermission(permissionName) {
    try {
        let permission = await navigator.permissions.query({name: permissionName});
        updatePermission(permissionName, permission.state);
        
        permission.addEventListener('change', function (e) {
            updatePermission(permissionName, permission.state);
        });
    } 
    catch (error) {
        console.log(error);
    }
}

function queryPermissions(){
    window.PermissionsList.forEach(function(permission){
        getPermission(permission);
    });
}

function updatePermission(permissionName, permissionState){
   document.getElementById(permissionName+"-p").innerHTML = `<span class="`+permissionState+`">`+permissionState+`</span>`;
}

function initializePermissionTable(){
    let container = document.getElementById("permission-results");
    window.PermissionsList.forEach(function(permission){
        container.innerHTML += `<tr><td>`+permission+`</td><td id="`+permission+`-p"><span>unknown</span></td></tr>`
    });
}

window.addEventListener("load", initializePermissionTable);
