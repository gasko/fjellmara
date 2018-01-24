<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
require_once '_db.php';

$output = array();
$query = "SELECT DISTINCT race AS name, year FROM results";

$sth = mysqli_query($conn, $query);

$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
  $rows[] = $r;
    //$rows['object_name'][] = $r;
}

function jsonResponse($status,$status_message,$data) {
header("HTTP/1.1 ".$status_message);
$response['status']=$status;
$response['status_message']=$status_message;
$response['data']=$data;
$json_response = json_encode($response);
echo $json_response;
}

//jsonResponse(200,"Item Found",$rows);
echo json_encode($rows);





?>
