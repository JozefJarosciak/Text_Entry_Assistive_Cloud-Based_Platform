<?php
error_reporting(0);
// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
include("credentials.php");
$q = htmlspecialchars(mb_strtolower(($_GET["q"])));
$host = "https://api.cognitive.microsoft.com";
$path = "/bing/v7.0/Suggestions";
$mkt = "en-US";
$query = urlencode($q);

function get_suggestions ($host, $path, $key, $mkt, $query) {
  $params = '?mkt=' . $mkt . '&q=' . $query;
  $headers = "Content-type: text/json\r\n" .
    "Ocp-Apim-Subscription-Key: $key\r\n";
  $options = array (
    'http' => array (
      'header' => $headers,
      'method' => 'GET'
    )
  );
  $context  = stream_context_create ($options);
  $result = file_get_contents ($host . $path . $params, false, $context);
  return $result;
}

$result = get_suggestions ($host, $path, $BingAutoSuggestAPIKey, $mkt, $query);
echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
?>