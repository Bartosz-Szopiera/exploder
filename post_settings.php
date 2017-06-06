<?php
require_once('mysqli_connect.php');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  die('Please log-in or create a new account.');
}

if (!isset($_SESSION['user_name'],
          $_POST['settings_name'],
          $_POST['scale'],
          $_POST['rand'],
          $_POST['range'],
          $_POST['density'],
          $_POST['speed'])) {
  die('Form data incomplete.');
}

$user_name = $_SESSION['user_name'];
$settings_name = $_POST['settings_name'];
$scale = $_POST['scale'];
$rand = $_POST['rand'];
$range = $_POST['range'];
$density = $_POST['density'];
$speed = $_POST['speed'];

$query = "INSERT INTO settings (user_name, settings_name,
          _scale, _rand, _range, _density, _speed)
          VALUES ('$user_name', '$settings_name',
          '$scale', '$rand', '$range', '$density', '$speed')";
$result = mysqli_query($dbc, $query);

if (!$result) {
  die("Error: " . mysqli_error($dbc));
}

$response['success'] = true;
$response['msg'] = 'Settings uploaded.';

header('Content-type: application/json');
echo json_encode($response);
?>
