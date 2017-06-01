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
      user_name VARCHAR(255) NOT NULL,
      expl_name VARCHAR(255) NOT NULL,
      _scale DECIMAL(3,2) NOT NULL,
      _rand DECIMAL(3,2) NOT NULL,
      _range DECIMAL(2,1) NOT NULL,
      _density INT(2) NOT NULL,
      _speed INT(2) NOT NULL
)";

if ($result = mysqli_query($dbc, $query)) {
  echo "Table 'settings' successfully created" . "<br>";
}
else {
  echo mysqli_error($dbc);
}
?>
