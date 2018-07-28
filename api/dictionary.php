<?php
$q = htmlspecialchars(mb_strtolower(($_GET["q"])));


$servername = "localhost";
$dbname = "dictionaries";

// this file has reference to '$username' and '$password' variables that needs to hold the user and password to your MySQL database
include('credentials.php');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//$sql = 'select * from textentry where word like "'.$q.'%" and word not like "'.$q.'"  order by LENGTH(word) ASC, rank ASC limit 10';
//$sql = 'select * from textentry where word like "'.$q.'%" and word not like "'.$q.'"  order by rank ASC limit 3';

$sql = 'select word from en_english479k where word like "'.$q.'%" and word not like "'.$q.'" and word not like "%-%" order by -rank DESC limit 1';


$result = $conn->query($sql);
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rows[] = strtolower ($row["word"]);
    }

//
print json_encode($rows);



}
 else {


$sql = 'select * from en_english479k where SOUNDEX(word) like SOUNDEX("'.$q.'") and CHAR_LENGTH(word)>=CHAR_LENGTH("'.$q.'") and word not like "%-%" order by CHAR_LENGTH(word) ASC, -rank DESC limit 1';

$result = $conn->query($sql);
$rows = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rows[] = strtolower ($row["word"]);
    }
   usort($rows, function ($a, $b) use ($userInput) {
            $levA = levenshtein($userInput, $a);
            $levB = levenshtein($userInput, $b);

            return $levA === $levB ? 0 : ($levA > $levB ? 1 : -1);
        });


         print json_encode($rows);

}



}


$conn->close();

?>