function init() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow;	
    var userPosOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function load(position) {

        var userCoords = position.coords;
        var latlng = {lat: userCoords.latitude, lng: userCoords.longitude};
        // Set marker position
        var markerCoords = new google.maps.LatLng(
            parseFloat(userCoords.latitude),
            parseFloat(userCoords.longitude)
        );
        var icon = "icon.png";
        var userMarker = new google.maps.Marker({
            map: map,
            position: markerCoords,
            icon: icon
        });	    
        var customLabel = {restaurant: {label: 'R'},bar: {label: 'B'}};
        var places = document.getElementById('places');
        var distance = document.getElementById('distInput').value;      
        var dataUrl = "get.php?dist="+distance+"&lat="+userCoords.latitude+"&lng="+userCoords.longitude;
        // Center map on user location
        initialLocation = new google.maps.LatLng(userCoords.latitude, userCoords.longitude);
        map.setCenter(initialLocation);
        // Print user lat / lng and accuracy
        document.getElementById('lat').innerHTML = 'Latitude : '+userCoords.latitude;
        document.getElementById("long").innerHTML = 'Longitude: '+userCoords.longitude;
        document.getElementById("accuracy").innerHTML = 'Accuracy: '+userCoords.accuracy+' meters.';
        // Print address from lat/lng
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

        downloadLocations('get.php', function(data) {
            places.innerHTML = '';			
            var xml = data.responseXML;     
            var markers = xml.documentElement.getElementsByTagName('marker');
            if(markers.length === 0) {
                places.innerHTML = '<li>Nothing was found :(</li>';
            } 
            Array.prototype.forEach.call(markers, function(markerElem) {
                var id = markerElem.getAttribute('id');
                var name = markerElem.getAttribute('name');
                var address = markerElem.getAttribute('address');
                var type = markerElem.getAttribute('type');
                var point = new google.maps.LatLng(
                    parseFloat(markerElem.getAttribute('lat')),
                    parseFloat(markerElem.getAttribute('lng'))
                );
                var infoWinContent = document.createElement('div');
                var strong = document.createElement('strong');
                strong.textContent = name;
                infoWinContent.appendChild(strong);
                infoWinContent.appendChild(document.createElement('br'));
                var text = document.createElement('text');
                text.textContent = address;
                infoWinContent.appendChild(text);
                var icon = customLabel[type] || {};
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    label: icon.label
                });
                marker.addListener('click', function() {
                    infoWindow.setContent(infoWinContent);
                    infoWindow.open(map, marker);
                });
                places.innerHTML += '<li>'+name+', '+address+', '+type+'</li>';      
            });
        });

        function downloadLocations(url, callback) {
            var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;
            request.open("GET", dataUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200) {
                    request.onreadystatechange = doNothing;
                    callback(request, request.status);
                }
            };
            request.send();
        }
    }

    /*
    Load current position
    */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(load, error, userPosOptions);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

};

/*
Update the value of distance field
*/
function updateDistInput(val) {
    document.getElementById('distInput').value = val;
}

function error(err) {
    console.warn('ERROR('+err.code+'): '+err.message);
};

/*
Called in downloadLocations()
Why?
*/
function doNothing() {}	