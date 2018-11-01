<?php
error_reporting(0);
//Total Key Presses: 1 | Total Characters: 0 | Total Words: 0 | Saved Keystrokes: 0 | Time to Complete: 00:00:00
$name = urldecode(htmlspecialchars(($_POST["n"])));
$email = urldecode(htmlspecialchars(($_POST["e"])));
$gender = urldecode(htmlspecialchars(($_POST["g"])));
$age = urldecode(htmlspecialchars(($_POST["a"])));

$totalKeypresses = urldecode(htmlspecialchars(($_POST["tk"])));
$totalCharacters = urldecode(htmlspecialchars(($_POST["tc"])));
$totalWords = urldecode(htmlspecialchars(($_POST["tw"])));
$savedKeystrokes = urldecode(htmlspecialchars(($_POST["sk"])));
$timeToComplete = urldecode(htmlspecialchars(($_POST["ttc"])));

$testType = urldecode(htmlspecialchars(($_POST["tt"])));
$textarea = urldecode(htmlspecialchars(($_POST["t"])));

$user_ip = getUserIP();

$servername = "localhost";
$dbname = "dictionaries";
include('credentials.php');
// Create connection
$conn = new mysqli($servername, $username, $credpsw, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//echo $timeToComplete."<br>";
$pieces = explode(":", $timeToComplete);
$time_seconds = (intval($pieces[0])*60) + intval($pieces[1]);

echo $pieces[0]."<br>";
echo $pieces[1]."<br>";
echo $pieces[2]."<br>";
//echo $timeToComplete; exit;


/*

$sql = "INSERT INTO `dictionaries`.`teapresults` (`ipaddress`, `email`, `gender`, `age`, `totalkeypresses`, `totalcharacters`, `totalwords`, `savedkeystrokes`, `timetocomplete`, `secondstocomplete`, `testtype`, `textarea`) VALUES ";
$sql .= "('".$user_ip."', '".$email."', '".$gender."', '".$age."', '".$totalKeypresses."', '".$totalCharacters."', '".$totalWords."', '".$savedKeystrokes."', '".$timeToComplete."', '".$time_seconds."', '".$testType."', '".$textarea."');";
$result = $conn->query($sql);
*/


$stmt = $conn->prepare("INSERT INTO dictionaries.teapresults (ipaddress, name, email, gender, age, totalkeypresses, totalcharacters, totalwords, savedkeystrokes, timetocomplete, secondstocomplete, testtype, textarea) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssiiiiisiis", $user_ip, $name, $email, $gender, $age, $totalKeypresses, $totalCharacters, $totalWords, $savedKeystrokes, $timeToComplete, $time_seconds, $testType, $textarea );
$stmt->execute();
$stmt->close();
$conn->close();

function getUserIP()
{
    // Get real visitor IP behind CloudFlare network
    if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
        $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
        $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
    }
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    return $ip;
}

echo "completed";
