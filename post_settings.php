<?php
require_once('mysqli_connect.php');
$user_name = $_SESSION['user_name'];
$query = "INSERT INTO settings (user_name, rand, range, speed) ";
$result = mysqli_query($dbc, $sql);
?>
