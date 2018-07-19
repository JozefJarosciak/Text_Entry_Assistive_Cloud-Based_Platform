<?php
$q = htmlspecialchars(mb_strtolower(($_GET["q"])));
include('connectdb.php');


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//$sql = 'select * from textentry where word like "'.$q.'%" and word not like "'.$q.'"  order by LENGTH(word) ASC, rank ASC limit 10';
$sql = 'select * from textentry where word like "'.$q.'%" and word not like "'.$q.'"  order by rank ASC limit 3';
$result = $conn->query($sql);
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rows[] = $row["word"];
    }

print json_encode($rows);

} else {
//    echo "0 results";
}



$conn->close();
?>