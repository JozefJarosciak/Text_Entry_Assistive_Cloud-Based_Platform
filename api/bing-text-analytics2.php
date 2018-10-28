<?php
error_reporting(0);
// this file has reference to '$bingTextAnalyticsKey' variable that needs to hold the Microsoft API key
include("credentials.php");
$q = htmlspecialchars(($_GET["q"]));
$w = htmlspecialchars(($_GET["w"]));

//$q = urldecode($q);
$data =array (
    'documents' =>
        array (
            0 =>
                array (
                    'language' => 'en',
                    'id' => '1',
                    'text' => $q,
                )
        ),
);

$data_string = json_encode($data);

$ch = curl_init('https://westus.api.cognitive.microsoft.com/text/analytics/v2.1-preview/entities');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Ocp-Apim-Subscription-Key: $BingTextAnalyticsAPIKey",
        'Content-Length: ' . strlen($data_string))
);

$result = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}

curl_close ($ch);
//print_r( $result );

$return =  json_decode($result, true);
/*
print "<pre>";
print_r( $return);
print "</pre>";
//exit;
*/

for ($i = 0; $i <= count($return[Documents][0][Entities])-1; $i++) {
    if ($i<=30) {
        echo $return[Documents][0][Entities][$i][WikipediaId]."|";
        if ($w==1) {} else {
    echo $return[Documents][0][Entities][$i][Name]."|";
        }
    }
}




?>
