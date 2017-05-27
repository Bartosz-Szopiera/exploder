<?php
require_once('mysqli_connect.php');
if (!session_id()) {
    session_start();
}
if(isset($_POST['user_name']) && isset($_POST['password'])) {

  $user_name = mysqli_real_escape_string($dbc, $_POST['user_name']);
  $password = mysqli_real_escape_string($dbc, $_POST['password']);
  $query = "SELECT user_name FROM users WHERE
          user_name='$user_name'
          and password='$password'";
  $result = mysqli_query($dbc, $sql);
  $count = mysqli_num_rows($query);
  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

  if ($count == 1) {
    $_SESSION['user_name'] = $row['user_name'];
    echo $row['user_name'];
  }
  else {
    echo "Login and Password don't match";
  }
}
?>
