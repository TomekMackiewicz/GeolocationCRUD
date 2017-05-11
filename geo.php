<?php

$lat = $_GET['lat'];
$lng = $_GET['lng'];

if(isset($_GET['dist'])) {
	$dist = $_GET['dist'];
} else {
	$dist = 5;
}

$doc = new DOMDocument( "1.0", "ISO-8859-15" );
$node = $doc->createElement("markers"); 
$parnode = $doc->appendChild($node);

$connection=mysqli_connect('localhost', 'root', 'root12', 'agageo');
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

//$query = "SELECT * FROM markers WHERE 1"; // where distance (lat,lng) less than...

$query = "SELECT
    id,
    name,
    address,
    type,
    lat,
    lng, 
    (
      6371 * acos (
        cos ( radians($lat) )
        * cos( radians( lat ) )
        * cos( radians( lng ) - radians($lng) )
        + sin ( radians($lat) )
        * sin( radians( lat ) )
      )
    ) AS distance
  FROM markers
  HAVING distance < $dist 
  ORDER BY distance
  LIMIT 0 , 20";

$result = mysqli_query($connection, $query);
if (!$result) {
  die('Invalid query.');
}

header( "content-type: application/xml; charset=ISO-8859-15" );

while ($row = mysqli_fetch_assoc($result)){
  $node = $doc->createElement("marker");
  $newnode = $parnode->appendChild($node);
  $newnode->setAttribute("id", $row['id']);
  $newnode->setAttribute("name", $row['name']);
  $newnode->setAttribute("address", $row['address']);
  $newnode->setAttribute("lat", $row['lat']);
  $newnode->setAttribute("lng", $row['lng']);
  $newnode->setAttribute("type", $row['type']);
}

print $doc->saveXML();

?>

