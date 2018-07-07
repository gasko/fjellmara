<?php
//§12
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
require_once '_db.php';
$queryFirstname = '';
$querySurname = '';
$queryYears = '';
$queryRaces = '';
$queryBib = '';
if (isset($_GET['bib'])){
    $bib = $_GET['bib'];
    $queryFirstname = "WHERE bib %{$bib}% AND";
}
if (isset($_GET['firstname'])){
    $firstname = $_GET['firstname'];
    $queryFirstname = "WHERE firstname %{$firstname}% AND";
}
if (isset($_GET['surname'])){
    $surname = $_GET['surname'];
    $querySurname = "WHERE surname %{$surname}% AND";
}
if (isset($_GET['races'])){
    $years = $_GET['races'];
    $queryRaces = "WHERE race IN {$races} AND";
}
if (isset($_GET['years'])){
    $years = $_GET['years'];
    $queryYears = "WHERE year IN {$years}";
}


$output = array();
$query = "SELECT firstname, surname, bib, race, year, YEAR(birthdate) AS birthyear
FROM results
{$queryBib}
{$queryFirstname}
{$querySurname}
{$queryRaces}
{$queryYears}
LIMIT 25";

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
