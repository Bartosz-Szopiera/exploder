<?php
// ---Distinguish parent script from includes
if (isset($script_name)) $child_script = true;
else {
  $script_name = $_SERVER['PHP_SELF'];
  $child_script = false;
}
// ---
require_once('mysqli_connect.php');
header('Content-type: application/json');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  $response['success'] = false;
  $response['msg'] = 'Log-in or create a new account.';
  die (json_encode($response));
}
$user_name = $_SESSION['user_name'];
$symbol_code = $_POST['symbol_code'];
$coordsX = $_POST['coordsX'];
$coordsY = $_POST['coordsY'];

// -----Check for identical symbol----------
$query = "SELECT * FROM symbols
          WHERE coordsX ='$coordsX'
          AND coordsY = '$coordsY'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
elseif (mysqli_num_rows($result) > 0) {
  $response['success'] = false;
  $response['msg'] = 'Symbol like that already exists.';
  die (json_encode($response));
}
// -----Check for symbol of the same name-------
$query = "SELECT * FROM symbols
          WHERE symbol_code ='$symbol_code'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
elseif (mysqli_num_rows($result) > 0) {
  $response['success'] = false;
  $response['msg'] = 'Symbol of that code already exists.';
  die (json_encode($response));
}
// -----Add symbol to the database------------
$query = "INSERT INTO symbols
          (user_name, symbol_code, coordsX, coordsY)
          VALUES
          ('$user_name', '$symbol_code', '$coordsX', '$coordsY')";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}

$response['success'] = true;
$response['msg'] = 'Symbol added to the database.';
$response['subject'] = 'symbols';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
