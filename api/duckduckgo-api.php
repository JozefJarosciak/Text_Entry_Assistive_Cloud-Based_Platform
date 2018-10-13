<?php

$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));

$url = 'https://api.duckduckgo.com/?format=json&pretty=1&skip_disambig=0&q='.$q;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

//print_r( $response );



/*
echo "<hr>";

print "<pre>";
print_r($response);
print "</pre>";

echo "<hr>";
*/

echo $response['Heading'] . '<br/>';
echo $response['Image']. '<br/>';
echo $response['AbstractURL'] . '<br/>';
echo $response['AbstractText'] . '<br/>';

echo "<hr>";

foreach ($response['Infobox']['content'] as $entity) {
    if (is_array ($entity['value']) !== true) {
    echo $entity['label'] . ': ' . $entity['value']. '<br/>';
    }
}









?>