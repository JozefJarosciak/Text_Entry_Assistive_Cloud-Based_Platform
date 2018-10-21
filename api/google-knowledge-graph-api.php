<?php
error_reporting(0);
$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));
include('credentials.php');

$service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
$params = array(
    'query' => $q,
    'limit' => 10,
    'prefix'=>TRUE,
    'indent' => TRUE,
    'key' => $google_api);


$url = $service_url . '?' . http_build_query($params);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$json = curl_exec($ch);
$response = json_decode($json, true);
curl_close($ch);

//echo  $json ;echo "<hr>";

foreach($response['itemListElement'] as $element) {
    echo $element['resultScore'] . '<br/>';
echo $element['result']['name'] . '<br/>';
echo $element['result']['description'] . '<br/>';
echo $element['result']['image']['contentUrl']. '<br/>';
echo $element['result']['detailedDescription']['url'] . '<br/>';
echo $element['result']['detailedDescription']['articleBody'] . '<br/>';
echo $element['result']['@type']['0'] . '<br/>';

$kgmid = str_replace('kg:/', 'kgmid=/', $element['result']['@id']);
echo 'https://www.google.com/search?q=%20&kponly&'.$kgmid . '<br/><hr>';


    //kgmid=/m/0tc7


}



?>