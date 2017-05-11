<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Add new location</title>
</head>
<body onload="initialize()">
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCFuaH_8dXWWtV4qDTLhobOVoB_GsljS_Y"></script>
<!--     <script type="text/javascript">
        window.onload = function () {
            var mapOptions = {
                center: new google.maps.LatLng(52.22937, 21.01135),
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var infoWindow = new google.maps.InfoWindow();
            var latlngbounds = new google.maps.LatLngBounds();
            var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
            google.maps.event.addListener(map, 'click', function (e) {
                //alert("Latitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng());
            var lat = document.getElementById('lat');
            var long = document.getElementById('long');
            lat.value = e.latLng.lat();  
            long.value = e.latLng.lng(); 

            });
        }
    </script> -->

<script>
  var geocoder;
  var map;
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(52.2296756, 21.012228700000037);
    var mapOptions = {
      zoom: 13,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function codeAddress() {
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
</script>

    <form action="process.php" method="post">
        Name:<br>
        <input type="text" id="name" name="name"><br>
        Address:<br>
        <input type="text" id="address" name="address" value="Warsaw"><br>
        Lat:<br>
        <input type="text" id="lat" name="lat"><br>
        Long:<br>
        <input type="text" id="long" name="long"><br>
        Type:<br>
        <select id="type" name="type">
          <option value="restaurant">Restaurant</option>
          <option value="bar">Bar</option>
        </select>
        <input type="submit" value="Submit">        
    </form>
    <input type="button" value="Show on map" onclick="codeAddress()">
    <div id="map" style="width: 500px; height: 500px">
    </div>
</body>
</html>
