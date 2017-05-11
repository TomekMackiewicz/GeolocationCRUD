function codeAddress() {
  var geocoder = new google.maps.Geocoder;
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location            
      });
      var lat = document.getElementById('lat');
      var long = document.getElementById('long');
      lat.value = results[0].geometry.location.lat();  
      long.value = results[0].geometry.location.lng();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}