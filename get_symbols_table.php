<?php
require_once('mysqli_connect.php');

$query = "SELECT * FROM symbols";
$result = mysqli_query($dbc,$query);
if (!$result) {die('Error: ' . mysqli_error($dbc));}

$data = mysqli_fetch_all($result, MYSQLI_NUM);

$response['success'] = true;
$response['msg'] = 'Symbols data downloaded.';
$response['data'] = $data;
$response['subject'] = 'symbols';

header('Content-type: application/json');
echo json_encode($response);
?>
