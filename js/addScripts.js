function init() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(52.2296756, 21.012228700000037),
        zoom: 15
    });
    var geocoder = new google.maps.Geocoder();

    this.addressToLocation = function() {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                var lat = document.getElementById('lat');
                var lng = document.getElementById('lng');
                lat.value = results[0].geometry.location.lat();
                lng.value = results[0].geometry.location.lng();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
}