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
  $response['msg'] = "Log-in or create a new account.";
  die (json_encode($response));
}
$user_name = $_SESSION['user_name'];
$current_symbol = $_POST['current_symbol'];
$symbol_code = $_POST['symbol_code'];
$coordsX = $_POST['coordsX'];
$coordsY = $_POST['coordsY'];

$query = "SELECT * FROM symbols WHERE
          symbol_code COLLATE latin1_general_cs ='$current_symbol'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
// ---Check if current_symbol exists
if (count($data) != 1) {
  $response['success'] = false;
  $response['msg'] = 'Current symbol does not exist.';
  die (json_encode($response));
}
// ---Check the ownership of the symbol
else if ($data[0]['user_name'] != $user_name) {
  $response['success'] = false;
  $response['msg'] = 'You can\'t edit symbols you haven\'t created';
}
// ---Check for identical symbol
$query = "SELECT * FROM symbols
          WHERE coordsX ='$coordsX'
          AND coordsY = '$coordsY'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
if (mysqli_num_rows($result) > 0 &&
    $data[0]['symbol_code'] != $current_symbol) {
  $response['success'] = false;
  $response['msg'] = 'Symbol like that already exists.';
  die (json_encode($response));
}
// ---ALL CHECKS PASSED
// ---Remove current symbol
$query = "DELETE FROM symbols
          WHERE symbol_code='$current_symbol'";
$result = mysqli_query($dbc,$query);
if (!$result) die('Error: ' . mysqli_error($dbc));
// ---Insert new symbol
$query = "INSERT INTO symbols
          (user_name, symbol_code, coordsX, coordsY)
          VALUES
          ('$user_name', '$symbol_code', '$coordsX', '$coordsY')";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}

$response['success'] = true;
$response['msg'] = 'Symbol changed.';
$response['subject'] = 'symbols';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
