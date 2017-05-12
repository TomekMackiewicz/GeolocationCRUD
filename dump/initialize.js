
var map;

function initialize() {
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(52.2296756, 21.012228700000037);
  var mapOptions = {
    zoom: 15,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
   