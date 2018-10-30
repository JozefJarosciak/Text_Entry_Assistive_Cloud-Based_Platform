<?php
error_reporting(0);

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

$sql = 'SELECT DISTINCT(word) FROM en_english479k WHERE CHAR_LENGTH(word) >= 10 AND word NOT LIKE \'% %\' AND word NOT LIKE \'%.%\' AND word NOT LIKE \'%-%\' AND word NOT LIKE \'%s\' AND word NOT LIKE \'%ed\' AND word NOT LIKE \'%al\' and word NOT LIKE \'%z%\' and word NOT LIKE \'%s%\' AND (ASCII(word) BETWEEN 97 AND 122) AND rank<10000 ORDER BY RAND(), rank DESC LIMIT 75';

$result = $conn->query($sql);
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rows[] =  ($row["word"]);
        echo  ($row["word"])." ";
    }
}

$conn->close();

?>