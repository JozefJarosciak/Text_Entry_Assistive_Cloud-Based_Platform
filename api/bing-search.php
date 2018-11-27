<?php
error_reporting(0);
// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
include("credentials.php");

$q = htmlspecialchars(mb_strtolower(($_GET["q"])));
$term = $q;
$accessKey = $BingSearchAPIKey;
$endpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/search';

function BingWebSearch($url, $key, $query)
{
    $headers = "Ocp-Apim-Subscription-Key: $key\r\n";
    $options = array('http' => array(
        'header' => $headers,
        'method' => 'GET'));
    // Perform the request and receive a response.
    $context = stream_context_create($options);
    $result = file_get_contents($url . "?q=" . urlencode($query) . "&answerCount=1&count=3&promote=RelatedSearches&responseFilter=Webpages", false, $context);
    // Extract Bing HTTP headers.
    $headers = array();
    foreach ($http_response_header as $k => $v) {
        $h = explode(":", $v, 2);
        if (isset($h[1]))
            if (preg_match("/^BingAPIs-/", $h[0]) || preg_match("/^X-MSEdge-/", $h[0]))
                $headers[trim($h[0])] = trim($h[1]);
    }
    return array($headers, $result);
}

if (strlen($accessKey) == 32) {
    list($headers, $json) = BingWebSearch($endpoint, $accessKey, $term);
    $return = json_encode(json_decode($json), JSON_PRETTY_PRINT);
    $data = json_decode($return, true);
    $post = "";
    for ($i = 0; $i <= count($data[webPages][value]) - 1; $i++) {
        $post .= $data[webPages][value][$i][name] . " ";
        $post .= $data[webPages][value][$i][snippet] . " ";
        $post .= $data[webPages][value][$i][name][about][0][name] . " ";
    }
    $post = trim($post);
    $postdata = http_build_query(
        array(
            'q' => $post
        )
    );

    $opts = array('http' =>
        array(
            'method' => 'POST',
            'header' => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
        )
    );
    $server = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';
    $context = stream_context_create($opts);
    $result = file_get_contents($server . 'wordfrequency.php', false, $context);
    echo $result . "<hr>";
    $result2 = file_get_contents($server . 'bing-text-analytics.php?q=' . urlencode($result));
    echo $result2;
}
?>