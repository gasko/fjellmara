<?php


echo "<table style='border: solid 1px black;'>";
echo "<tr><th>Id</th><th>Firstname</th><th>Lastname</th></tr>";

class TableRows extends RecursiveIteratorIterator {
    function __construct($it) {
        parent::__construct($it, self::LEAVES_ONLY);
    }

    function current() {
        return "<td style='width:150px;border:1px solid black;'>" . parent::current(). "</td>";
    }

    function beginChildren() {
        echo "<tr>";
    }

    function endChildren() {
        echo "</tr>" . "\n";
    }
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fjelldata";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    /*$sgl="SELECT SEC_TO_TIME(TIME_TO_SEC(timepassed)/(300)*300)
    AS timekey, count(*)
    FROM checkpoints c INNER JOIN results r
    ON c.results_id = r.id
    WHERE
	   c.name = 'Hållfjället' AND
     r.year = 2017 AND
     r.race = 'Fjällmaraton' AND
     timepassed BETWEEN '01:30:00' AND '05:30:00'
    GROUP BY TIME_TO_SEC(timepassed) DIV 300, name"
    */
    $sql = "SELECT id, firstname, surname FROM results"

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) {
        echo $v;
    }
}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
echo "</table>";

?>
