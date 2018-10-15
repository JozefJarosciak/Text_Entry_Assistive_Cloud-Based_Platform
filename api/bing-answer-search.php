<?php
error_reporting(0);
// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
$subscriptionKeyAnswer = 'f5a7781232a24303b09e3a4d1739073';
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

$data = json_decode($result, true);
//echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);

if ($data[webPages][value][0][about][0][name]) {
    echo $data[webPages][value][0][about][0][name]. "|<br>";
} else{
    echo $data[entities][value][0][name]. "|<br>";
}
echo $data[webPages][value][0][about][0][name]. "|<br>";
echo $data[webPages][value][0][url] . "|<br>";
echo $data[webPages][value][0][snippet]. "|<br>";

echo $data[entities][value][0][description]. "|<br>";



echo $data[webPages][value][0][deepLinks][0][snippet]. " ...";


print "<pre>";
print_r ( $data);
print "</pre>";

?>