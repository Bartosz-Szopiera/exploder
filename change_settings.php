<?php
header('Content-type: application/json');
// ---Distinguish parent script from includes
if (isset($script_name)) $parent_script = false;
else {
  $script_name = $_SERVER['PHP_SELF'];
  $parent_script = true;
}
// ---
require_once('mysqli_connect.php');
if (!session_id()) {
  session_start();
}
if (!isset($_SESSION['logged'])) {
  $response['success'] = false;
  $response['msg'] = 'You are not logged-in.';
}

$post = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['user_name'],
          $post['settings_name'],
          $post['settings'],
          $post['forces'])) {
  die('Form data incomplete.');
}

// $current_settings = $_POST['current_settings'];
// $user_name = $_SESSION['user_name'];
// $settings_name = $_POST['settings_name'];

$user_name = $_SESSION['user_name'];
$settings_name = $post['settings_name'];
$speed = $post['settings']['speed'];
$duration = $post['settings']['duration'];
$settings_id = $post['settings_id'];

$query = "SELECT * FROM settings WHERE
          _id='$settings_id'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}
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

// Insert general settings

$query = "UPDATE settings SET
          settings_name = '$settings_name',
          _speed = '$speed',
          _duration = '$duration'
          WHERE _id='$settings_id'";
if (!$result = mysqli_query($dbc, $query)) {
  die("Error: " . mysqli_error($dbc));
}

// Delete old forces settings

$query = "DELETE FROM forces WHERE
          _id='$settings_id'";
if (!$result = mysqli_query($dbc,$query)) {
  die('Error: ' . mysqli_error($dbc));
}

// Insert new forces settings

$id = $settings_id;
$forces = $post['forces'];

for ($i=0; $i < count($forces); $i++) {
  $key = array_keys($forces)[$i];
  // $position = $forces[$key]['position'];
  $positionX = $forces[$key]['position'][0];
  $positionY = $forces[$key]['position'][1];
  $value = $forces[$key]['value'];
  $rad1 = $forces[$key]['rad1'];
  $rad2 = $forces[$key]['rad2'];
  $rad3 = $forces[$key]['rad3'];
  $type = $forces[$key]['type'];
  $query = "INSERT INTO forces (_id, _positionX, _positionY, _value,
            _rad1, _rad2, _rad3, _type)
            VALUES ('$id', '$positionX', '$positionY', '$value',
            '$rad1', '$rad2', '$rad3', '$type')";
  if (!$result = mysqli_query($dbc, $query)){
    die("Error: " . mysqli_error($dbc));
  }
}

// ---Delete old current settings
// $query = "DELETE FROM settings WHERE
//           settings_name='$current_settings'";
// if (!$result = mysqli_query($dbc,$query)) {
//   die('Error: ' . mysqli_error($dbc));
// }

// Add new settings
// require_once('post_settings.php');

if ($parent_script) {
  $response['success'] = true;
  $response['msg'] = 'Settings changed.';
  echo json_encode($response);
}
// --- Get back to parent
$parent_script = true;
?>
