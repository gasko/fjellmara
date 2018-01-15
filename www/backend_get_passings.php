<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
$conn = mysqli_connect("localhost", "root", "", "fjelldata");
/* change character set to utf8 */
$conn->set_charset("utf8");

$race = "Fjällmaraton";
if (isset($_GET['race'])){
    $race = $_GET['race'];
    if ($race == "fjallmara") {
      $race = "Fjällmaraton";
    }
}

$year = 2017;
if (isset($_GET['year'])){
    $year = $_GET['year'];
}

$checkpoint = "Hållfjället";
if (isset($_GET['checkpoint'])){
    $checkpoint = $_GET['checkpoint'];
    if ($checkpoint == "hallfjallet") {
      $checkpoint = "Hållfjället";
    }
}
//need to add safety.. must be number >0
$time_in_sec = 300;
if (isset($_GET['t'])){
    $time_in_sec = $_GET['t'] * 60;
}

$output = array();

$query = " SELECT DISTINCT count(DISTINCT r.year) AS cntyear
FROM checkpoints c INNER JOIN results r
ON c.results_id = r.id
WHERE
c.name = '{$checkpoint}' AND
r.race = '{$race}'";

$sth = mysqli_query($conn, $query);
$r = mysqli_fetch_assoc($sth);
$cntyear = $r["cntyear"];
// echo "cntyear: ";
// echo $cntyear;
// echo "\n";

// $query =
//   " SELECT DATE_FORMAT(SEC_TO_TIME(ROUND(TIME_TO_SEC(timepassed) DIV {$time_in_sec})*{$time_in_sec}), '%I:%i')
//         AS time, count(*) AS count
//         FROM checkpoints c INNER JOIN results r
//         ON c.results_id = r.id
//         WHERE
//         c.name = '{$checkpoint}' AND
//         r.year = {$year} AND
//         r.race = '{$race}'
//         GROUP BY TIME_TO_SEC(timepassed) DIV ${time_in_sec}, name ";

$query =
  " SELECT DATE_FORMAT(SEC_TO_TIME(ROUND(TIME_TO_SEC(timepassed) DIV {$time_in_sec})*{$time_in_sec}), '%I:%i')
        AS time, count(*)/$cntyear AS count
        FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
        c.name = '{$checkpoint}' AND
        r.race = '{$race}'
        GROUP BY TIME_TO_SEC(timepassed) DIV ${time_in_sec}, name ";


$sth = mysqli_query($conn, $query);

$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
  $rows[] = $r;
}
echo json_encode($rows);

?>
