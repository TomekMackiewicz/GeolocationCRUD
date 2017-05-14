function init() {

    var map, 
        geocoder, 
        infoWindow, 
        userPosOptions;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    geocoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow;	
    userPosOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function load(position) {
        
        var userCoords, 
            latlng, 
            markerCoords, 
            icon, 
            userMarker, 
            customLabel, 
            places, 
            distance, 
            dataUrl,
            initialLocation;
        
        userCoords = position.coords;
        latlng = {lat: userCoords.latitude, lng: userCoords.longitude};
        // Set marker position
        markerCoords = new google.maps.LatLng(
            parseFloat(userCoords.latitude),
            parseFloat(userCoords.longitude)
        );
        icon = "icon.png";
        userMarker = new google.maps.Marker({
            map: map,
            position: markerCoords,
            icon: icon
        });	    
        customLabel = {restaurant: {label: 'R'},bar: {label: 'B'}};
        places = document.getElementById('places');
        distance = document.getElementById('distInput').value;      
        dataUrl = "get.php?dist="+distance+"&lat="+userCoords.latitude+"&lng="+userCoords.longitude;
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
            
            var xml, markers;
            
            places.innerHTML = '';			
            xml = data.responseXML;     
            markers = xml.documentElement.getElementsByTagName('marker');
            if(markers.length === 0) {
                places.innerHTML = '<li>Nothing was found :(</li>';
            } 
            Array.prototype.forEach.call(markers, function(markerElem) {
                
                var id,
                    name, 
                    address, 
                    type, 
                    point, 
                    infoWinContent, 
                    strong, 
                    text, 
                    icon, 
                    marker;
                
                id = markerElem.getAttribute('id');
                name = markerElem.getAttribute('name');
                address = markerElem.getAttribute('address');
                type = markerElem.getAttribute('type');
                point = new google.maps.LatLng(
                    parseFloat(markerElem.getAttribute('lat')),
                    parseFloat(markerElem.getAttribute('lng'))
                );
                infoWinContent = document.createElement('div');
                strong = document.createElement('strong');
                strong.textContent = name;
                infoWinContent.appendChild(strong);
                infoWinContent.appendChild(document.createElement('br'));
                text = document.createElement('text');
                text.textContent = address;
                infoWinContent.appendChild(text);
                icon = customLabel[type] || {};
                marker = new google.maps.Marker({
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
   this.currentPosition = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(load, error, userPosOptions);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    /*
    Load address
    */
    this.addressToLocation = function() {
        var address = document.getElementById('address').value;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status === 'OK') {
                var position = {
                    'coords': {
                        latitude:results[0].geometry.location.lat(), 
                        longitude:results[0].geometry.location.lng()                    
                    }
                };
                load(position);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    /*
    Load current position on init
    */
    //currentPosition();
    
}

/*
Update the value of distance field
*/
function updateDistInput(val) {
    document.getElementById('distInput').value = val;
}

function error(err) {
    console.warn('ERROR('+err.code+'): '+err.message);
}

/*
Called in downloadLocations()
Why?
*/
function doNothing() {}	
