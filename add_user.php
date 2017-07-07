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
  $response['msg'] = 'You are already registered.';
}
elseif(isset($_POST['user_name']) && isset($_POST['password'])) {
  $user_name = mysqli_real_escape_string($dbc, $_POST['user_name']);
  $password = mysqli_real_escape_string($dbc, $_POST['password']);
  $query = "SELECT * FROM users WHERE user_name='$user_name'";
  if (!$result = mysqli_query($dbc, $query)) {
    die ('Error: ' . mysqli_error($dbc));
  }

  if (mysqli_num_rows($result) > 0) {
    $response['success'] = false;
    $response['msg'] = 'User already exists. Login or register with different User Name.';
  }
  else {
    $query = "INSERT INTO users (user_name, password)
              VALUES ('$user_name', '$password')";
    $result = mysqli_query($dbc, $query);

    if (!$result) {
      die ('Error: ' . mysqli_error($dbc));
    }
    else {
      $_SESSION['logged'] = true;
      $_SESSION['user_name'] = $_POST['user_name'];
      $_SESSION['password'] = $_POST['password'];
      $response['success'] = true;
      $response['msg'] = 'User registered.';
      $response['userName'] = $_POST['user_name'];
    }
  }
}
else {
  $response['success'] = false;
  $response['msg'] = 'Please fill all required fields.';
}

echo json_encode($response);
// --- Get back to parent
$parent_script = true;
?>
