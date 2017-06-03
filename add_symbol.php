<?php
require_once('mysqli_connect.php');
header("Content-type: application/json");
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  $response['success'] = false;
  $response['msg'] = 'Log-in or create a new account.';
}
$user_name = $_SESSION['user_name'];
$symbol_code = $_POST['symbol_code'];
$coordsX = $_POST['coordsX'];
$coordsY = $_POST['coordsY'];

// -----Check for identical symbol----------
$query = "SELECT * FROM coordinates
          WHERE coords ='$coordsX'
          AND coords = '$coordsY'";
$result = mysqli_query($dbc,$query);
if (!result) {die(mysqli_error($dbc));}
elseif (mysqli_num_rows($result) > 0) {
  $response['success'] = false;
  $response['msg'] = 'Symbol like that already exists.';
  die (json_encode($response));
}
// -----Check for symbol of the same name-------
$query = "SELECT * FROM coordinates
          WHERE symbol_code ='$symbol_code'";
$result = mysqli_query($dbc,$query);
if (!result) {die(mysqli_error($dbc));}
elseif (mysqli_num_rows($result) > 0) {
  $response['success'] = false;
  $response['msg'] = 'Symbol of that code already exists.';
  die (json_encode($response));
}
// ---------------------------------------------
$query = "INSERT INTO symbols (user_name, symbol_code)
          VALUES ('$user_name', '$symbol_code')";
$result = mysqli_query($dbc,$query);
if (!result) {die(mysqli_error($dbc));}

$query = "INSERT INTO coordinates (symbol_code, axis, coords)
          VALUES ('$symbol_code', 'x', '$coordsX')";
$result = mysqli_query($dbc,$query);
if (!result) {die(mysqli_error($dbc));}

$query = "INSERT INTO coordinates (symbol_code, axis, coords)
          VALUES ('$symbol_code', 'y', '$coordsY')";
$result = mysqli_query($dbc,$query);
if (!result) {die(mysqli_error($dbc));}

$response['success'] = true;
$response['msg'] = 'Symbol added to the database.';

echo json_encode($response);
?>
