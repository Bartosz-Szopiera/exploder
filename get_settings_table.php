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

// Get general settings
$query = "SELECT * FROM settings";
$result = mysqli_query($dbc,$query);
if (!$result) {
  die('Error: ' . mysqli_error($dbc));
}
$data['settings'] = mysqli_fetch_all($result, MYSQLI_NUM);
// $data = mysqli_fetch_all($result, MYSQLI_NUM);

// Get forces settings
$query = "SELECT * FROM forces";
$result = mysqli_query($dbc,$query);
if (!$result) {
  die('Error: ' . mysqli_error($dbc));
}
$data['forces'] = mysqli_fetch_all($result, MYSQLI_NUM);

$response['success'] = true;
$response['msg'] = 'Settings data downloaded.';
// $response['data'] = $data;
// $response['data'] = json_encode($data);
$response['data']['settings'] = $data['settings'];
$response['data']['forces'] = $data['forces'];
$response['subject'] = 'settings';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
