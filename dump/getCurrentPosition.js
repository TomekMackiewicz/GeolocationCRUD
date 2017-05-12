/*
Show user location:
print data,
set marker,
center map.
*/
function showUserLocation(position) {
    var crd = position.coords;
    // Print user lat / lng and accuracy
    var userLat = document.getElementById('lat');
    var userLong = document.getElementById("long");
    var userAccuracy = document.getElementById("accuracy");
    userLat.innerHTML = `Latitude : ${crd.latitude}`;
    userLong.innerHTML = `Longitude: ${crd.longitude}`;
    userAccuracy.innerHTML = `Accuracy: ${crd.accuracy} meters.`;
    // Print address from lat/lng
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: crd.latitude, lng: crd.longitude};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                document.getElementById("formatted_address").innerHTML 
                = results[1].formatted_address;
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
    // Set marker position
    var userCoords = new google.maps.LatLng(
        parseFloat(crd.latitude),
        parseFloat(crd.longitude)
    );
    var icon = "icon.png";
    var userMarker = new google.maps.Marker({
        map: map,
        position: userCoords,
        icon: icon
    });
    // Center map on user location
    initialLocation = new google.maps.LatLng(crd.latitude, crd.longitude);
    map.setCenter(initialLocation);
};

function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
};

/*
Geolocation
Send location data to showUserLocation function.
*/
(function(){

	var userPosOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showUserLocation, error, userPosOptions);
		//navigator.geolocation.getCurrentPosition(initMap);
	} else {
		alert("Geolocation is not supported by this browser.");
	}

})();

/*
Called in downloadLocations()
Why?
*/
function doNothing() {}

/*
Update the value of distance field
*/
function updateDistInput(val) {
	document.getElementById('distInput').value = val; 
}