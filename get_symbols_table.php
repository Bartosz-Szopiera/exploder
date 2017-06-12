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

$query = "SELECT * FROM symbols";
$result = mysqli_query($dbc,$query);
if (!$result) {die('Error: ' . mysqli_error($dbc));}

$data = mysqli_fetch_all($result, MYSQLI_NUM);

$response['success'] = true;
$response['msg'] = 'Symbols data downloaded.';
$response['data'] = $data;
$response['subject'] = 'symbols';

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
