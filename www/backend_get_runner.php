<?php

//§12
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
require_once '_db.php';

//need to add safety.. must be number >0
$bib = 100;
if (isset($_GET['bib'])){
    $bib = $_GET['bib'];
}


/**
 *            |   män & kvinnor | Gender | Födelseår | Klass
 * Position
 *    cp 1
 *    cp 2
 *      |
 *    cp n
 *    mål
 * Medeltempo
 * Passerade
 *
 */

//$output = array();
// echo $checkpoint;
// echo $year;
// echo $race;

function getRunnerPosition($conn, $race, $year, $checkpoint, $time_sec, $gender, $class){
  //runners before All
  if ($gender){
    $where_gender = "r.gender LIKE '{$gender}' AND";
  } else {
    $where_gender = '';
  }
  if ($class){
    $where_class = "r.class LIKE '{$class}' AND";
  } else {
    $where_class = '';
  }

  $query =
    " SELECT count(*) AS count
          FROM checkpoints c INNER JOIN results r
          ON c.results_id = r.id
          WHERE
          c.name = '{$checkpoint}' AND
          r.year = {$year} AND
          r.race = '{$race}' AND
          $where_gender
          $where_class
          TIME_TO_SEC(c.timepassed) <= {$time_sec}";

  $sth = mysqli_query($conn, $query);
  $r = mysqli_fetch_assoc($sth);
  $count = $r["count"];
  return $count;
}



$query =
  " SELECT  r.id AS results_id,
            r.firstname AS firstname,
            r.surname AS surname,
            r.gender AS gender,
            co.code AS nation_code2,
            co.countrycode AS nation_code3,
            co.countryname AS nation_name,
            r.birthdate AS birthdate,
            r.club AS club,
            r.race AS race,
            r.year AS year,
            r.bib AS bib,
            r.class AS class,
            r.time AS time
        FROM results r LEFT JOIN country co
          ON r.nation = co.countrycode
        WHERE
        r.year = {$year} AND
        r.race = '{$race}' AND
        r.bib = {$bib}";

$sth = mysqli_query($conn, $query);
//$rows = array();
$r = mysqli_fetch_assoc($sth);
$time = $r["time"];
$gender = $r["gender"];
$class = $r["class"];
$results_id = $r['results_id'];
$nation['name']= $r['nation_name'];
$nation['code2']= $r['nation_code2'];
$nation['code3']= $r['nation_code3'];
$r['nation'] = $nation;
unset($r['nation_name']);
unset($r['nation_code2']);
unset($r['nation_code3']);
unset($r['results_id']);
// echo json_encode($r);
// echo "\n";

//passing time
$query =
  " SELECT name, timepassed, TIME_TO_SEC(timepassed) AS timepassed_sec, timeofday, location_order AS cpOrder
        FROM checkpoints
        WHERE
        results_id = {$results_id}
        ORDER BY location_order";

$sth = mysqli_query($conn, $query);
$rows = array();
while($cp = mysqli_fetch_assoc($sth)) {
  $position['all'] = getRunnerPosition($conn, $race, $year, $cp['name'], $cp['timepassed_sec'], NULL, NULL);
  $position['gender'] = getRunnerPosition($conn, $race, $year, $cp['name'], $cp['timepassed_sec'], $gender, NULL);
  $position['class'] = getRunnerPosition($conn, $race, $year, $cp['name'], $cp['timepassed_sec'], NULL,  $class);
  $cp['position']=$position;

  $timepassed['inFormat']=$cp['timepassed'];
  $timepassed['inSec']=$cp['timepassed_sec'];
  unset($cp['timepassed']);
  unset($cp['timepassed_sec']);
  $cp['timepassed']=$timepassed;
  $rows[] = $cp;
}

$r['checkpoints'] = $rows;
echo json_encode($r);
?>
