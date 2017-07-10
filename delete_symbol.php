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
$current_symbol = $_POST['current_symbol'];

$query = "SELECT * FROM symbols WHERE
          symbol_code COLLATE latin1_general_cs ='$current_symbol'";
$result = mysqli_query($dbc, $query);
if (!$result) {die('ERROR: ' . mysqli_error($dbc));}
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
// ---ALL CHECKS PASSED
// ---Remove current symbol
$query = "DELETE FROM symbols
          WHERE symbol_code='$current_symbol'";
$result = mysqli_query($dbc,$query);
if (!$result) die('Error: ' . mysqli_error($dbc));

$response['success'] = true;
$response['msg'] = 'Symbol deleted.';
$response['subject'] = 'symbols';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
