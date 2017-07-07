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
  $response['msg'] = 'You are already logged-out.';
}
else {
  setcookie(session_name(), '', time() - 999, '/');
  session_unset();
  session_destroy();
  $response['msg'] = 'Logged-out.';
}
$response['success'] = true;

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
