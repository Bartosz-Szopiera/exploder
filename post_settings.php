<?php
require_once('mysqli_connect.php');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  die('Please log-in or create a new account.');
}

$user_name = $_SESSION['user_name'];
$expl_name = $_POST['expl_name'];
$scale = $_POST['scale'];
$rand = $_POST['rand'];
$range = $_POST['range'];
$density = $_POST['density'];
$speed = $_POST['speed'];

$query = "INSERT INTO settings (user_name, expl_name,
          _scale, _rand, _range, _density, _speed)
          VALUES ('$user_name', '$expl_name',
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
