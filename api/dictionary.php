<?php
error_reporting(0);
$q = htmlspecialchars((($_GET["q"])));
$offset = htmlspecialchars((($_GET["f"])));
$charLen = htmlspecialchars((($_GET["c"])));
$servername = "localhost";
$dbname = "dictionaries";

// this file has reference to '$username' and '$password' variables that needs to hold the user and password to your MySQL database
include('credentials.php');

// Create connection
$conn = new mysqli($servername, $username, $credpsw, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($charLen) {
    $lenghtLimit = "AND (rank>0 and rank<50000) AND (ASCII(word) BETWEEN 97 AND 122) AND CHAR_LENGTH(word) >= " . $charLen . " AND word NOT LIKE '% %' AND word NOT LIKE '%.%' AND word NOT LIKE '%s' AND word NOT LIKE '%ed' AND word NOT LIKE '%al' and word NOT LIKE '%z%' and word NOT LIKE '%s%'";
} else {
    $lenghtLimit = "AND CHAR_LENGTH(word) >= 0";
}

$sql = 'select word from en_english479k where word like "' . $q . '%" and word not like "' . $q . '" and word not like "%-%" ' . $lenghtLimit . ' order by -rank DESC limit 1 OFFSET ' . $offset;


$result = $conn->query($sql);
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
        $rows[] = ($row["word"]);
        echo($row["word"]);//."|";
    }


} else {

    if ($charLen) {
        $lenghtLimit = "AND CHAR_LENGTH(word) >= " . $charLen;
    }
    $sql = 'SELECT * FROM en_english479k WHERE word <> "' . $q . '" and SOUNDEX(word) like SOUNDEX("' . $q . '") and levenshtein(word, "' . $q . '")<=2 ' . $lenghtLimit . ' order by -rank desc, -levenshtein(word, "' . $q . '") desc limit 1';
    $result = $conn->query($sql);
    $rows = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $rows[] = ($row["word"]);
            echo($row["word"]);//."|";
        }

    }
}


$conn->close();

?>