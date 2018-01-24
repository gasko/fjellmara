<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
require_once '_db.php';
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
