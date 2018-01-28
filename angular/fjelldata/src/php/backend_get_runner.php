<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");
require_once '_db.php';

//need to add safety.. must be number >0
$bib = 100;
if (isset($_GET['bib'])){
    $bib = $_GET['bib'];
}


/**
 * Position  |   män & kvinnor | Gender | Födelseår | Klass
 * Position
 * Medeltempo
 * Passerade
 *
 */

$output = array();
// echo $checkpoint;
// echo $year;
// echo $race;

$query =
  " SELECT  r.gender AS gender,
            r.nation AS nation,
            r.birthday AS birthday,
            r.club AS club
        FROM results r
        WHERE
        r.year = {$year} AND
        r.race = '{$race}' AND
        r.bib = {$bib}";

$sth = mysqli_query($conn, $query);
$rows = array();
$r = mysqli_fetch_assoc($sth);
$time = $r["time"];
echo $time;
echo "\n";

//passing time
$query =
  " SELECT  c.timepassed AS time
        FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
        c.name = '{$checkpoint}' AND
        r.year = {$year} AND
        r.race = '{$race}' AND
        r.bib = {$bib}";

$sth = mysqli_query($conn, $query);
$rows = array();
$r = mysqli_fetch_assoc($sth);
$time = $r["time"];
echo $time;
echo "\n";

//runners before All
$query =
  " SELECT count(*) AS count
        FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
        c.name = '{$checkpoint}' AND
        r.year = {$year} AND
        r.race = '{$race}' AND
        c.timepassed > '{$time}'";

$sth = mysqli_query($conn, $query);
$rows = array();
$r = mysqli_fetch_assoc($sth);
$count = $r["count"];
echo $count;
echo "\n";

//runners before All
$query =
  " SELECT count(*) AS count
        FROM checkpoints c INNER JOIN results r
        ON c.results_id = r.id
        WHERE
        c.name = '{$checkpoint}' AND
        r.year = {$year} AND
        r.race = '{$race}' AND
        c.timepassed > '{$time}'";

$sth = mysqli_query($conn, $query);
$rows = array();
$r = mysqli_fetch_assoc($sth);
$count = $r["count"];
echo $count;
echo "\n";
/*
SELECT count(*) AS count
      FROM checkpoints c INNER JOIN results r
      ON c.results_id = r.id
      WHERE
      c.name = 'Hållfjället' AND
      r.year = 2017 AND
      r.race = 'Fjällmaraton' AND
      c.timepassed > '03:06:00';
*/
?>
