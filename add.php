<?php

require_once('connection.php');

$name = $_POST['name'];
$address = $_POST['address'];
$lat = $_POST['lat'];
$long = $_POST['long'];
$type = $_POST['type'];

$query = "INSERT INTO markers (name, address, lat, lng, type) VALUES ('$name', '$address', $lat, $long, '$type')";
if ($connection->query($query) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $query . "<br>" . $connection->error;
}

$connection->close();
