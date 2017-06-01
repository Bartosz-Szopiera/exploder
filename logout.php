<?php
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
  $response['msg'] = 'Session data destroyed.';
}
$response['success'] = true;

header('Content-type: application/json');
echo json_encode($response);
?>
