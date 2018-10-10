<?php

$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));
include('credentials.php');

$service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
$params = array(
    'query' => urlencode($q),
    'limit' => 1,
    'indent' => TRUE,
    'key' => $google_api);


$url = $service_url . '?' . http_build_query($params);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

print_r( $response );


echo "<hr>";

foreach($response['itemListElement'] as $element) {

echo $element['result']['name'] . '<br/>';
echo $element['result']['description'] . '<br/>';
echo $element['result']['image']['contentUrl']. '<br/>';
echo $element['result']['detailedDescription']['url'] . '<br/>';
echo $element['result']['detailedDescription']['articleBody'] . '<br/>';
echo $element['result']['@type']['0'] . '<br/>';

}



?>