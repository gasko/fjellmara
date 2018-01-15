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

// $query =
//   " SELECT count(*) AS count
//         FROM checkpoints c INNER JOIN results r
//         ON c.results_id = r.id
//         WHERE
//         c.name = '{$checkpoint}' AND
//         r.year = {$year} AND
//         r.race = '{$race}'";

function sec2time($seconds){
  return gmdate("H:i:s", (int)$seconds);
}

// get number all passings ever
function get_allpass($conn, $race, $checkpoint) {
  $query =
    " SELECT count(*) AS allpass
          FROM checkpoints c INNER JOIN results r
          ON c.results_id = r.id
          WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";

  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["allpass"];
}

function get_passings($conn, $race, $checkpoint, $time_in_sec){
  $query =
    " SELECT DATE_FORMAT(SEC_TO_TIME(ROUND(TIME_TO_SEC(timepassed) DIV {$time_in_sec})*{$time_in_sec}), '%I:%i')
          AS time, count(*) AS count
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
  return $rows;
}


function get_avgtime($conn, $race, $checkpoint) {
  $query =
    " SELECT AVG(TIME_TO_SEC(`timepassed`)) AS avgtime
      FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";

  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["avgtime"];
}

function get_stddev($conn, $race, $checkpoint){
  $query =
    " SELECT STDDEV(TIME_TO_SEC(`timepassed`)) AS stddevi
      FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";
  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["stddevi"];
}

function get_fastest_time($conn, $race, $checkpoint){
  $query =
    " SELECT MIN(TIME_TO_SEC(`timepassed`)) AS mintime
      FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";
  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["mintime"];
}

function get_slowest_time($conn, $race, $checkpoint){
  $query =
    " SELECT MAX(TIME_TO_SEC(`timepassed`)) AS maxtime
      FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";
  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["maxtime"];
}

function get_numberofraces($conn, $race, $checkpoint) {
  $query =
    " SELECT count(DISTINCT r.year) AS numberofraces
          FROM checkpoints c INNER JOIN results r
          ON c.results_id = r.id
          WHERE
          c.name = '{$checkpoint}' AND
          r.race = '{$race}'";

  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  return $r["numberofraces"];
}

function echo_all($conn, $race, $checkpoint){
  echo "all runners: ";
  echo get_allpass($conn, $race, $checkpoint);
  echo "\n";

  echo "fastest: ";
  echo get_fastest_time($conn, $race, $checkpoint);
  echo "\n";

  echo "slowest: ";
  echo get_slowest_time($conn, $race, $checkpoint);
  echo "\n";

  echo "stddev: ";
  echo get_stddev($conn, $race, $checkpoint);
  echo "\n";
  echo sec2time(get_stddev($conn, $race, $checkpoint));
  echo "\n";

  echo "avgtime: ";
  echo get_avgtime($conn, $race, $checkpoint);
  echo "\n";
  echo sec2time(get_avgtime($conn, $race, $checkpoint));

  echo "numberofraces: ";
  echo get_numberofraces($conn, $race, $checkpoint);
  echo "\n";
}

/**
 *
 */
$stddev = get_stddev($conn, $race, $checkpoint);
$avgtime = get_avgtime($conn, $race, $checkpoint);
$fastesttime = get_fastest_time($conn, $race, $checkpoint);
$slowesttime = get_slowest_time($conn, $race, $checkpoint);
$numberofraces = get_numberofraces($conn, $race, $checkpoint);
$jsonret = array(
  'tot_runners' => get_allpass($conn, $race, $checkpoint),
  'fastest_time' => sec2time($fastesttime),
  'fastest_time_sec' => $fastesttime,
  'slowest_time' => sec2time($slowesttime),
  'slowest_time_sec' => $slowesttime,
  'stddev' => sec2time($stddev),
  'stddev_sec' => $stddev,
  'avgtime' => sec2time($avgtime),
  'avgtime_sec' => $avgtime,
  'numberofraces' => $numberofraces,
  'passings' => get_passings($conn, $race, $checkpoint, $time_in_sec)
);

// $jsonret->tot_runners = get_allpass($conn, $race, $checkpoint);
// $jsonret->fastest_time = get_fastest_time($conn, $race, $checkpoint);
// $jsonret->slowest_time = get_slowest_time($conn, $race, $checkpoint);
// $stddev = get_stddev($conn, $race, $checkpoint);
// $jsonret->stddev = sec2time($stddev);
// $jsonret->stddev_sec = $stddev;
// $avgtime = get_avgtime($conn, $race, $checkpoint);
// $jsonret->avgtime = sec2time($avgtime);
// $jsonret->avgtime_sec = $avgtime;

echo json_encode($jsonret);
?>
