<?php
require_once('mysqli_connect.php');

$query = "SELECT * FROM settings";
$result = mysqli_query($dbc, $query);
if (!$result) {
  die('Error: ' . mysqli_error($dbc));
}
$data = mysqli_fetch_all($result, MYSQLI_NUM);

$response['success'] = true;
$response['msg'] = 'Data downloaded.';
$response['data'] = $data;

header('Content-type: application/json');
echo json_encode($response);
?>
