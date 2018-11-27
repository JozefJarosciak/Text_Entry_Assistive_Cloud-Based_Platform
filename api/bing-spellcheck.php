<?php
error_reporting(0);
// this file has reference to '$Bing Spellcheck API_key' variable that needs to hold the Microsoft API key
include("credentials.php");
$q = htmlspecialchars(mb_strtolower(($_GET["q"])));
$host = 'https://api.cognitive.microsoft.com';
$path = '/bing/v7.0/spellcheck?';
$params = 'mkt=en-us&mode=proof';
$input = $q;
$data = array('text' => urlencode($input));
$headers = "Content-type: application/x-www-form-urlencoded\r\n" .
    "Ocp-Apim-Subscription-Key: $BingSpellcheckAPIKey\r\n";

$options = array(
    'http' => array(
        'header' => $headers,
        'method' => 'POST',
        'content' => http_build_query($data)
    )
);
$context = stream_context_create($options);
$result = file_get_contents($host . $path . $params, false, $context);
$json = json_encode(json_decode($result), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
print $json;
print "</pre>\n";
?>