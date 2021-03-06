<?php
// header("Content-Type:application/json");
// header("Access-Control-Allow-Origin: *");
$conn = mysqli_connect("localhost", "root", "", "fjelldata");
//$conn = mysqli_connect("monoski.se.mysql", "monoski_se", "NbKrcVJe", "monoski_se");
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

$checkpoint = "Hållfjället";
if (isset($_GET['checkpoint'])){
    $checkpoint = $_GET['checkpoint'];
    if ($checkpoint == "hallfjallet") {
      $checkpoint = "Hållfjället";
    }
}


function sec2time($seconds){
  return gmdate("H:i:s", (int)$seconds);
}

function time2sec($time /* HH:MM:SS */){
  list($hour_, $minute_, $second_) = explode(':', $time);
  return ($hour_ * 3600) + ($minute_ * 60) + $second_;
}
?>
