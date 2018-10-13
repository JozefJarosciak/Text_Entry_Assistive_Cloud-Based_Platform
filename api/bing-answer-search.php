<?php

// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
include("credentials.php");


$q = htmlspecialchars(mb_strtolower(($_GET["q"])));

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.



$host = "https://api.labs.cognitive.microsoft.com";
$path = "/answersearch/v7.0/search";

$mkt = "en-US";
$query = urlencode($q);

$count=1;
$offset=0;
$safesearch="Moderate";


function get_suggestions ($host, $path, $subscriptionKeyAnswer, $mkt, $count, $offset, $safesearch, $query) {

    $params = '?mkt=' . $mkt . '&count=' . $count. '&offset=' . $offset. '&safesearch=' . $safesearch. '&q=' . $query;

    $headers = "Content-type: text/json\r\n" .
        "Ocp-Apim-Subscription-Key: $subscriptionKeyAnswer\r\n";

    // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
    // http://php.net/manual/en/function.stream-context-create.php
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

$result = get_suggestions ($host, $path, $subscriptionKeyAnswer, $mkt, $count, $offset, $safesearch, $query);
$result = json_encode(json_decode ($result), JSON_PRETTY_PRINT);
//echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);

print "<pre>";
print_r($result);
print "</pre>";

?>