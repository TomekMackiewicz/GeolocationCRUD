function downloadLocations(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var dist = document.getElementById('distInput').value;      
      var url = "get.php?dist="+dist+"&lat="+pos.lat+"&lng="+pos.lng;
    
      request.open("GET", url, true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.onreadystatechange = function() {
          if(request.readyState == 4 && request.status == 200) {
              request.onreadystatechange = doNothing;
              callback(request, request.status);
          }
      }
      request.send();
    });
  } else {
      alert("Geolocation is not supported by this browser.");
  }
}