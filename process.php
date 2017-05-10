<?php

$connection=mysqli_connect('localhost', 'root', 'simone', 'agageo');
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

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