window.PermissionsList = [
  "geolocation",
  "notifications",
  "persistent-storage",
  "camera",
  "microphone",
  "clipboard-read",
  "clipboard-write",
  "accelerometer",
  "gyroscope",
  "magnetometer",
  "ambient-light-sensor",
  "background-sync",
  "periodic-background-sync",
  "midi"
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
