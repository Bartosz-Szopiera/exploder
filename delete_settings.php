<?php
header('Content-type: application/json');
// ---Distinguish parent script from includes
if (isset($script_name)) $child_script = true;
else {
  $script_name = $_SERVER['PHP_SELF'];
  $child_script = false;
}
// ---
require_once('mysqli_connect.php');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  $response['success'] = false;
  $response['msg'] = 'You are not logged-in.';
}

$current_settings = $_POST['current_settings'];
$settings_id = $_POST['settings_id'];
$user_name = $_SESSION['user_name'];

$query = "SELECT * FROM settings WHERE
          _id = '$settings_id'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
// ---Check if settings exist
if (count($data) != 1) {
  $response['success'] = false;
  $response['msg'] = 'No such settings exist.';
  die (json_encode($response));
}
// ---Check if user owns given settings
if ($data[0]['user_name'] != $user_name) {
  $response['success'] = false;
  $response['msg'] = 'You have no permission to edit those settings.';
  die (json_encode($response));
}
// Deleted related forces
$query = "DELETE FROM forces WHERE
          _id='$settings_id'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
// ---Delete old current settings
$query = "DELETE FROM settings WHERE
          _id='$settings_id'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}

$response['success'] = true;
$response['msg'] = 'Settings removed.';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
