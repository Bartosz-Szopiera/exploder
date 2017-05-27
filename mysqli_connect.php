<?php
// Define connenction parameters

define("DB_HOST","localhost");
define("DB_USER","root");
define("DB_PASSWORD","");
define("DB_NAME","exploder_db");

 $dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
  OR die('Could not connect to MySQL: ' . mysqli_connect_error());

?>
