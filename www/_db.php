<?php

$host = "localhost";
$port = "";
$username = "root";
$password = "";
$database = "fjelldata";

$db = new PDO("mysql:host=$host;port=$port",
               $username,
               $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
