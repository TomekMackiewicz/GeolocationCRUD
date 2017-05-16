function init() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(52.2296756, 21.012228700000037),
        zoom: 15
    });
    var geocoder = new google.maps.Geocoder;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var infoWindow = new google.maps.InfoWindow;
    var userPosOptions = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0};
    var iconUser = "icon.png";
    var iconWay = "way.png";
    var places = document.getElementById('places');
    var distance = document.getElementById('distInput').value;

    /*
     * Load locations and user location.
     * Print locations and addresses.
     */
    function load(position) {
        var userCoords = position.coords;
        var latlng = {lat: userCoords.latitude, lng: userCoords.longitude};
        var locationLabel = {restaurant: {label: 'R'}, bar: {label: 'B'}};
        var dataUrl = "get.php?dist=" + distance + "&lat=" + userCoords.latitude + "&lng=" + userCoords.longitude;

        /*
         * Set marker position.
         */
        var userMarkerCoords = new google.maps.LatLng(parseFloat(userCoords.latitude), parseFloat(userCoords.longitude));
        var userMarker = new google.maps.Marker({
            map: map,
            position: userMarkerCoords,
            icon: iconUser
        });

        /*
         * Center map on user location.
         */
        var initialLocation = new google.maps.LatLng(userCoords.latitude, userCoords.longitude);
        map.setCenter(initialLocation);

        /*
         * Print user lat / lng and accuracy.
         */
        document.getElementById('lat').innerHTML = 'Latitude : ' + userCoords.latitude;
        document.getElementById("lng").innerHTML = 'Longitude: ' + userCoords.longitude;
        if (userCoords.accuracy) {
            document.getElementById("accuracy").innerHTML = 'Accuracy: ' + userCoords.accuracy + ' meters.';
        } else {
            document.getElementById("accuracy").innerHTML = '';
        }

        /*
         * Print address from lat/lng.
         */
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    document.getElementById("formatted_address").innerHTML = results[1].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });

        /*
         * Load locations from database.
         */
        downloadLocations('get.php', function(data) {
            places.innerHTML = '';
            var xml = data.responseXML;
            var markers = xml.documentElement.getElementsByTagName('marker');
            if (markers.length === 0) {
                places.innerHTML = '<li>Nothing was found :(</li>';
            }
            Array.prototype.forEach.call(markers, function(markerElem) {
                var id = markerElem.getAttribute('id');
                var name = markerElem.getAttribute('name');
                var address = markerElem.getAttribute('address');
                var type = markerElem.getAttribute('type');
                var point = new google.maps.LatLng(parseFloat(markerElem.getAttribute('lat')), parseFloat(markerElem.getAttribute('lng')));

                /*
                 * Print markers info windows.
                 */
                var infoWinContent = document.createElement('div');
                var strong = document.createElement('strong');
                strong.textContent = name;
                infoWinContent.appendChild(strong);
                infoWinContent.appendChild(document.createElement('br'));
                var text = document.createElement('text');
                text.textContent = address;
                infoWinContent.appendChild(text);
                infoWinContent.appendChild(document.createElement('br'));
                var way = document.createElement("img");
                way.setAttribute("src", "way.png");
                way.setAttribute("height", "36");
                way.setAttribute("width", "36");
                way.setAttribute("alt", "Search route");
                infoWinContent.appendChild(way);

                /*
                 * Print locations markers.
                 */
                var locationIcon = locationLabel[type] || {};
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    label: locationIcon.label
                });
                marker.addListener('click', function() {
                    infoWindow.setContent(infoWinContent);
                    infoWindow.open(map, marker);
                });

                /*
                 * Listen to fingd route
                 */
                way.addEventListener('click', function() {
                    findRoute(map, userMarkerCoords, directionsDisplay, text);
                });

                /*
                 * Print places list
                 */
                places.innerHTML += '<li>' + name + ', ' + address + ', ' + type + '</li>';
            });
        });

        function downloadLocations(url, callback) {
            var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
            request.open("GET", dataUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status === 200) {
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
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                var position = {
                    'coords': {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    }
                };
                load(position);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
}

/*
 Update the value of distance field
 */
function updateDistInput(val) {
    document.getElementById('distInput').value = val;
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

/*
 Called in downloadLocations()
 Why?
 */
function doNothing() {}

function findRoute(map, markerCoords, directionsDisplay, endpoint) {
    document.getElementById('directionsPanel').innerHTML = "";
    var directionsService = new google.maps.DirectionsService();
    //var start = document.getElementById('formatted_address').innerHTML;
    var start = markerCoords;
    var end = endpoint.innerHTML;
    var selectedMode = document.getElementById('travelMode').value;
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    var request = {
        origin: start,
        destination: end,
        travelMode: selectedMode
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
        }
    });
}
