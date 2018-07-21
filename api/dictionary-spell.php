<?php
$q = htmlspecialchars(mb_strtolower(($_GET["q"])));

//$q = end(explode(PHP_EOL,$q));$q = end(explode('.',$q));

//$q = end(preg_split('/[^a-z0-9]/i', $q));

include('connectdb.php');

if (strlen($q)>=3) {
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = 'select word from en_english479k where SOUNDEX(word) like SOUNDEX("'.$q.'") and CHAR_LENGTH(word)>=CHAR_LENGTH("'.$q.'") order by CHAR_LENGTH(word) ASC, -rank DESC limit 5';

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