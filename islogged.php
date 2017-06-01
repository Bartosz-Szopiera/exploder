<?php
require_once('mysqli_connect.php');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'], $_SESSION['user_name'],
          $_SESSION['password'])) {
    die('User is not logged in.');
}
else {
  $user_name = $_SESSION['user_name'];
  $password = $_SESSION['password'];
  $query = "SELECT user_name FROM users WHERE
            user_name='$user_name'
            and password='$password'";
  $result = mysqli_query($dbc, $query);
  if (!$result) {
    $response['success'] = false;
    $response['msg'] = 'Error: ' . mysqli_error($dbc);
  }
  elseif (mysqli_num_rows($result) == 1) {
      $response['success'] = true;
      $response['msg'] = 'User is currently logged-in.';
      $response['userName'] = $_SESSION['user_name'];
  }
  else {
      $response['success'] = false;
      $response['msg'] = 'User no longer exists.';
      setcookie(session_name(), '', time() - 999, '/');
      session_unset();
      session_destroy();
  }
}
header('Content-type: application/json');
echo json_encode($response);
?>
