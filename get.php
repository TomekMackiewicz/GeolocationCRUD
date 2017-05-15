<?php

require_once('connection.php');

$lat = filter_input(INPUT_GET, 'lat', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$lng = filter_input(INPUT_GET, 'lng', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

//file_put_contents('log.txt', $_GET['lat']);
//file_put_contents('log.txt', $lat);

if (isset($_GET['dist'])) {
    $dist = filter_input(INPUT_GET, 'dist', FILTER_SANITIZE_NUMBER_INT);
} else {
    $dist = 5;
}

$doc = new DOMDocument("1.0", "ISO-8859-15");
$node = $doc->createElement("markers");
$parnode = $doc->appendChild($node);

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
  LIMIT 0 , 200";

$result = mysqli_query($connection, $query);
if (!$result) {
    die('Invalid query.');
}

header("content-type: application/xml; charset=ISO-8859-15");

while ($row = mysqli_fetch_assoc($result)) {
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

$connection->close();
