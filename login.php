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
if (isset($_SESSION['logged'])) {
  $response['success'] = false;
  $response['msg'] = 'User already logged-in.';
}
else {
  if(isset($_POST['user_name'], $_POST['password'])) {

    $user_name = mysqli_real_escape_string($dbc, $_POST['user_name']);
    $password = mysqli_real_escape_string($dbc, $_POST['password']);
    $query = "SELECT user_name FROM users WHERE
        user_name='$user_name'
        and password='$password'";
    $result = mysqli_query($dbc, $query);

    if (!$result) {
      die('Error: ' . mysqli_error($dbc));
    }

    $count = mysqli_num_rows($result); //number of affected rows
    if ($count == 1) {
      $_SESSION['logged'] = true;
      $_SESSION['user_name'] = $_POST['user_name'];
      $_SESSION['password'] = $_POST['password'];
      $response['success'] = true;
      $response['msg'] = 'User logged-in.';
      $response['userName'] = $_POST['user_name'];
    }
    else {
      $response['success'] = false;
      $response['msg'] = 'User Name and Password don\'t match.';
    }
  }
}
echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
