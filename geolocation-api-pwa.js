function updateMap(position){
    // These are the coordinates returned by the Geolocation API
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
  
    // Recenter our map around the coordinates
    window.demoMap.setView([latitude, longitude], 13);
  
    // Add a marker at the specified coordinates
    var marker = L.marker([latitude, longitude]).addTo(window.demoMap);

    // Add a popup to the marker
    marker.bindPopup("Hello, this is your location!");

    // For demo purposes only, display the latitude and longitude to the user
    alert("Latitude:"+latitude+", Longitude:"+longitude);
}

function geolocationInaccessible(err){
    //for demo purposes only, we show why location data can't be accessed
    alert(err.message);
}

function requestLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(updateMap, geolocationInaccessible);
    }
    else {    
        alert("Your current browser does not support the Geolocation feature.");
    }   
}

function createMap(){
    // Create a default map
    window.demoMap = L.map("map").setView([48.8584, 2.2945], 2);
  
    // Add a tile layer from OpenStreetMap's default tile server
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(window.demoMap); 
}
