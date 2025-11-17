window.PermissionsList = ["geolocation", "notifications", "camera", "microphone", "background-sync", "ambient-light-sensor", "accelerometer", "gyroscope", "magnetometer"]
    
async function printPermission(permissionName, descriptor) {
    try {
        let permission = await navigator.permissions.query(Object.assign({name: permissionName}, descriptor));
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
        printPermission(permission);
    });
}

function updatePermission(permissionName, permission.state){
   document.getElementById(permissionName+"-p").innerHTML = permission.state;
}

function initializePermissionTable(){
    let container = document.getElementById("permission-results");
    window.PermissionsList.forEach(function(permission){
        container.innerHTML += `<tr><td>`+permission+`</td><td id="`+permission+`-p"><pre>unknown</pre></td></tr>`
    });
}

window.addEventListener("load", initializePermissionTable);
