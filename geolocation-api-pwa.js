function requestLocation(){
  if (window.Geolocation){
    window.Geolocation.getCurrentPosition(function(position){
      createMap(position.coors.latitude, position.coors.longitude);
    })
  }
  else {    
     alert("Your current browser does not support the Geolocation feature.");
  }   
}

function createMap(latitude, longitude){
    // Create a map centered at the specified coordinates
    var map = L.map('map').setView([latitude, longitude], 13);

    // Add a tile layer from OpenStreetMap's default tile server
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the specified coordinates
    var marker = L.marker([latitude, longitude]).addTo(map);

    // Add a popup to the marker
    marker.bindPopup("Hello, this is your location!");
}

let leafletScript = document.createElement("script");
leafletScript.setAttribute("script", "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js");
document.querySelector('body').appendChild(leafletScript);
