<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
$conn = mysqli_connect("localhost", "root", "", "fjelldata");
/* change character set to utf8 */
$conn->set_charset("utf8");

$race = "Fjällmaraton";
if (isset($_GET['race'])){
  $race = $_GET['race'];
  switch($race) {
    case "fjallmara": {
      $race = "Fjällmaraton";
      break;
    }
    case "27k": {
      $race = "27K";
      break;
    }
    case "Salomon 27K": {
      $race = "27K";
      break;
    }
    case "oppet-fjall": {
      $race = "Öppet Fjäll";
      break;
    }
    case "kvartsmara": {
      $race = "Kvartsmaraton";
      break;
    }
    case "valliste": {
      $race = "Välliste Runt";
      break;
    }
    case "copper-trail": {
      $race = "Copper Trail";
      break;
    }
    case "verticalk": {
      $race = "Vertical K";
      break;
    }
    case "bydalsfjallen22": {
      $race = "Bydalen Fjällmaraton 22K";
      break;
    }
    case "bydalsfjallen50": {
      $race = "Bydalen Fjällmaraton 50K";
      break;
    }
    default: {
      break;
    }
  }
}

$year = 2017;
if (isset($_GET['year'])){
    $year = $_GET['year'];
}
//need to add safety.. must be number >0
$time_in_sec = 300;
if (isset($_GET['t'])){
    $time_in_sec = $_GET['t'] * 60;
}

$output = array();

$query = "SELECT DISTINCT c.name AS name, c.location_order as location_order
FROM checkpoints c INNER JOIN results r
ON c.results_id = r.id
WHERE
r.race = '{$race}'
ORDER BY location_order";

$sth = mysqli_query($conn, $query);

$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
  $rows[] = $r;
}
echo json_encode($rows);

?>
