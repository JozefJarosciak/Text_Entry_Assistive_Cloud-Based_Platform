<?php
error_reporting(0);
include('credentials.php');
$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));
$data = '{
  "document":{
    "type":"PLAIN_TEXT",
    "content":"' . $q . '"
  },
  "encodingType":"UTF8"
}';

$payload = $data;
$url = 'https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment?key=' . $google_nlp_api;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLINFO_HEADER_OUT, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload))
);

$result = curl_exec($ch);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
$count = 0;
foreach ($response["entities"] as $entity) {
    echo $entity["name"] . ' | ' . $entity["type"] . ' | ' . $entity["metadata"]["wikipedia_url"] . '<br/>';
    $count++;
}

?>