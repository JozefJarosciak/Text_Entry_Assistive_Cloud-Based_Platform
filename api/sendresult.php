<?php
error_reporting(0);
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
$similarity = urldecode(htmlspecialchars(($_POST["s"])));
$transcribedText = urldecode(htmlspecialchars(($_POST["wt"])));
$wordpredictions = urldecode(htmlspecialchars(($_POST["wp"])));
$wordpredictionscount = urldecode(htmlspecialchars(($_POST["wc"])));
$wordlookupscount = urldecode(htmlspecialchars(($_POST["wlc"])));
$wordlookups = urldecode(htmlspecialchars(($_POST["wl"])));
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

$pieces = explode(":", $timeToComplete);
$time_seconds = (intval($pieces[0])*60) + intval($pieces[1]);

echo $pieces[0]."<br>";
echo $pieces[1]."<br>";
echo $pieces[2]."<br>";

$stmt = $conn->prepare("INSERT INTO dictionaries.teapresults (ipaddress, name, email, gender, age, totalkeypresses, totalcharacters, totalwords,
 savedkeystrokes, timetocomplete, secondstocomplete, testtype, similarity, textarea, transcribedText, wordpredictionscount, wordpredictions,
  wordlookupscount, wordlookups) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssiiiiisiidssisis", $user_ip, $name, $email, $gender, $age, $totalKeypresses, $totalCharacters, $totalWords,
    $savedKeystrokes, $timeToComplete, $time_seconds, $testType, $similarity, $textarea, $transcribedText, $wordpredictionscount, $wordpredictions,
    $wordlookupscount, $wordlookups );
$stmt->execute();
$stmt->close();
$conn->close();

function getUserIP()
{
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
