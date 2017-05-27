<?php
require_once('mysqli_connect.php');
if (!session_id()) {
    session_start();
}
if(isset($_POST['user_name']) && isset($_POST['password'])) {

  $user_name = mysqli_real_escape_string($dbc, $_POST['user_name']);
  $password = mysqli_real_escape_string($dbc, $_POST['password']);

  $query = "SELECT * FROM users WHERE user_name='$user_name'";
  $result = mysqli_query($dbc, $query);

  if (mysqli_num_rows($result) > 0) {
    echo 'User already exists';
  }
  elseif (!$result) {
    echo 'Error: ' . mysqli_error($dbc);
  }
  else {
    $query = "INSERT INTO users (user_name, password)
              VALUES ('$user_name', '$password')";
    if ($result = mysqli_query($dbc, $query)) {
      $count = mysqli_num_rows($result);
      if ($count == 1) {
        $_SESSION['user_name'] = $user_name;
        echo $row['user_name'];
      }
      else {
        echo 'Error: ' . mysqli_error($dbc);
      }
    }
    else {
      echo 'Error: ' . mysqli_error($dbc);
    }
  }
}
?>
