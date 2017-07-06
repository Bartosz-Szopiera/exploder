<?php
// Establish connection with the database
require_once('mysqli_connect.php');

// Create users table
$query = "CREATE TABLE IF NOT EXISTS users(
      user_name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      PRIMARY KEY (user_name)
)";

// Send query
if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'users' successfully created" . "<br>";
}
else {
  echo mysqli_error($dbc);
}

// Create settings table
$query = "CREATE TABLE IF NOT EXISTS settings(
      _id INT(10) NOT NULL AUTO_INCREMENT,
      user_name VARCHAR(255) NOT NULL CHECK (user_name <> ''),
      settings_name VARCHAR(255) NOT NULL CHECK (settings_name <> ''),
      _speed INT(2) NOT NULL,
      _duration INT(2) NOT NULL,
      PRIMARY KEY (_id)
)";

if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'settings' successfully created" . "<br>";
}
else {
  echo mysqli_error($dbc);
}

// Create forces table
$query = "CREATE TABLE IF NOT EXISTS forces(
      _id INT(10) NOT NULL,
      _positionX INT(255) NOT NULL,
      _positionY INT(255) NOT NULL,
      _value DECIMAL(3,2) NOT NULL,
      _rad1 DECIMAL(18,15) NOT NULL,
      _rad2 DECIMAL(18,15) NOT NULL,
      _rad3 DECIMAL(18,15) NOT NULL,
      _type INT(1) NOT NULL,
      FOREIGN KEY (_id) references settings (_id)
)";
if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'forces' successfully created." . "<br>";
}
else {
  echo mysqli_error($dbc);
}

// Create symbols table
$query = "CREATE TABLE IF NOT EXISTS symbols(
      user_name VARCHAR(255) NOT NULL,
      symbol_code VARCHAR(255) NOT NULL,
      coordsX VARCHAR(1020) NOT NULL,
      coordsY VARCHAR(1020) NOT NULL
)";

if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'symbols' successfully created" . "<br>";
}
else {
  echo mysqli_error($dbc);
}
?>
