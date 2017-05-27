<?php
require_once('mysqli_connect.php');
$user_name = $_SESSION['user_name'];
$query = "SELECT * FROM settings";
$result = mysqli_query($dbc, $sql);

if ($result) {
  $row = mysqli_fetch_assoc($result);
  while ($row) {
    $data[] = $row;
  }
  echo json_encode($data);
}
?>
