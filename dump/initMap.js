var map;     

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
  });

  var infoWindow = new google.maps.InfoWindow;
  var customLabel = {restaurant: {label: 'R'},bar: {label: 'B'}};
  var places = document.getElementById('places');

  downloadLocations('get.php', function(data) {
    var xml = data.responseXML;
    if(xml.activeElement.children.length == 0) {
      places.innerHTML = '<li>Nothing was found :(</li>';
    }      
    var markers = xml.documentElement.getElementsByTagName('marker');

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
      strong.textContent = name
      infoWinContent.appendChild(strong);
      infoWinContent.appendChild(document.createElement('br'));
      var text = document.createElement('text');
      text.textContent = address
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
      //var places = document.getElementById('places');
      places.innerHTML += '<li>'+name+', '+address+', '+type+'</li>';      
    });
  });
}