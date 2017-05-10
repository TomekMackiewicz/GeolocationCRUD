<?php

$doc = new DOMDocument( "1.0", "ISO-8859-15" );
$node = $doc->createElement("markers"); 
$parnode = $doc->appendChild($node);

$connection=mysqli_connect('localhost', 'root', 'root12', 'agageo');
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

$query = "SELECT * FROM markers WHERE 1";
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