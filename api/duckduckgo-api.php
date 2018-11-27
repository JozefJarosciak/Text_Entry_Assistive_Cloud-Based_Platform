<?php
error_reporting(0);
$q = ($_GET["q"]);
$url = 'https://api.duckduckgo.com/?format=json&pretty=1&skip_disambig=1&q='.urlencode($q);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
echo $response['Heading'] . '|';
echo $response['Image']. '|';
echo $response['AbstractURL'] . '|';
echo $response['AbstractText'] . '|';
foreach ($response['Infobox']['content'] as $entity) {
    if (is_array ($entity['value']) !== true) {
    echo $entity['label'] . ': ' . $entity['value']. '|';
    }
}
?>