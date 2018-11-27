<?php
error_reporting(0);
$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));
$level = urldecode(htmlspecialchars(mb_strtolower(($_GET["d"]))));
include('credentials.php');
$service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
$params = array(
    'query' => $q,
    'limit' => 1,
    'prefix' => TRUE,
    'indent' => TRUE,
    'key' => $google_kg_api);


$url = $service_url . '?' . http_build_query($params);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$json = curl_exec($ch);
$response = json_decode($json, true);
curl_close($ch);
foreach ($response['itemListElement'] as $element) {
    if ($level == 0) {
        echo " <h3>" . $element['result']['name'] . ' </h3><br/>';
        echo " " . $element['result']['description'] . ' <br/>';
        echo " " . $element['result']['detailedDescription']['articleBody'] . ' <br/>';
        $kgmid = str_replace('kg:/', 'kgmid=/', $element['result']['@id']);
    } else {
        if (strpos($element['result']['detailedDescription']['url'], 'wikipedia') !== false) {
        }
    }
}
?>