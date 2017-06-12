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
  $response['msg'] = '';
}

$current_settings = $_POST['current_settings'];
$user_name = $_SESSION['user_name'];
// $settings_name = $_POST['settings_name'];

$query = "SELECT * FROM settings WHERE
          settings_name='$current_settings'";
$result = mysqli_query($dbc,$query);
if(!$result) die('Error: ' . mysqli_error($dbc));
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
// ---Check if settings exist
if (count($data) != 1) {
  $response['success'] = false;
  $response['msg'] = 'No such settings exist.';
  die (json_encode($response));
}
// ---Check if user own given settings
if ($data[0]['user_name'] != $user_name) {
  $response['success'] = false;
  $response['msg'] = 'You have no permission to edit those settings.';
  die (json_encode($response));
}
// ---Delete old current settings
$query = "DELETE FROM settings WHERE
          settings_name='$current_settings'";
$result = mysqli_query($dbc, $query);
if (!$result) die('Error: ' . mysqli_error($dbc));

// Add new settings
require_once('post_settings.php');

if ($parent_script) {
  $response['success'] = true;
  $response['msg'] = 'Settings changed.';
  echo json_encode($response);
}
// --- Get back to parent
$parent_script = true;
?>
