<?php
error_reporting(0);
include('credentials.php');
$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));


// Data in JSON format
$data = '{
  "document":{
    "type":"PLAIN_TEXT",
    "content":"'.$q.'"
  },
  "encodingType":"UTF8"
}';

//$payload = json_encode($data);
$payload = $data;
$url = 'https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment?key='.$google_nlp_api;
// Prepare new cURL resource
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLINFO_HEADER_OUT, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// Set HTTP Header for POST request
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload))
);

// Submit the POST request
$result = curl_exec($ch);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

print_r($result);

//echo "<hr>";

$count = 0;
foreach ($response["entities"] as $entity) {

    echo $entity["name"] . ' | ' . $entity["type"] . ' | ' . $entity["metadata"]["wikipedia_url"]. '<br/>';
    $count++;
}

?>