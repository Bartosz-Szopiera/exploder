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
      user_name VARCHAR(255) NOT NULL CHECK (user_name <> ''),
      settings_name VARCHAR(255) NOT NULL CHECK (settings_name <> ''),
      _scale DECIMAL(3,2) NOT NULL CHECK (_scale <> ''),
      _rand DECIMAL(3,2) NOT NULL CHECK (_rand <> ''),
      _range DECIMAL(2,1) NOT NULL CHECK (_range <> ''),
      _density INT(2) NOT NULL CHECK (_density <> ''),
      _speed INT(2) NOT NULL CHECK (_speed <> '')
)";

if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'settings' successfully created" . "<br>";
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
  echo "Table 'coords' successfully created" . "<br>";
}
else {
  echo mysqli_error($dbc);
}
?>
