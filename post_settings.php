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

// Insert general settings

$user_name = $_SESSION['user_name'];
$settings_name = $post['settings_name'];
$speed = $post['settings']['speed'];
$duration = $post['settings']['duration'];

$query = "INSERT INTO settings (user_name, settings_name,
          _speed, _duration)
          VALUES ('$user_name', '$settings_name',
          '$speed', '$duration')";
if (!$result = mysqli_query($dbc, $query)) {
  die("Error: " . mysqli_error($dbc));
}

// Insert forces settings

$id = mysqli_insert_id($dbc);
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

if ($parent_script) {
  $response['success'] = true;
  $response['msg'] = 'Settings saved.';
  echo json_encode($response);
}
else {
  // --- Get back to parent
  $parent_script = true;
}
?>
