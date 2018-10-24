<?php
error_reporting(0);
// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
include("credentials.php");

$q = htmlspecialchars(mb_strtolower(($_GET["q"])));
$term = $q;

$accessKey = $bingSearch;
$endpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/search';

function BingWebSearch ($url, $key, $query) {
    /*
     * Prepare the HTTP request.
     * NOTE: Use the key 'http' even if you are making an HTTPS request.
     * See: http://php.net/manual/en/function.stream-context-create.php.
     */
    $headers = "Ocp-Apim-Subscription-Key: $key\r\n";
    $options = array ('http' => array (
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
// Validate the subscription key.
if (strlen($accessKey) == 32) {
    //print "Searching the Web for: " . $term . "\n";
    // Makes the request.
    list($headers, $json) = BingWebSearch($endpoint, $accessKey, $term);

    /*
    print "\nRelevant Headers:\n\n";
    foreach ($headers as $k => $v) {
        print $k . ": " . $v . "\n";
    }
    */

    // Prints JSON encoded response.
  //  print "\nJSON Response:\n\n";
//    echo json_encode(json_decode($json), JSON_PRETTY_PRINT);

$return = json_encode(json_decode($json), JSON_PRETTY_PRINT);
    $data = json_decode($return, true);

/*
print "<pre>";
print_r( $data );
print "</pre>";
*/
//echo "count:".count($data[webPages][value]);

    $post = "";
    for ($i = 0; $i <= count($data[webPages][value])-1; $i++) {
        $post .= $data[webPages][value][$i][name]." ";
        $post .=  $data[webPages][value][$i][snippet]." ";
        $post .=  $data[webPages][value][$i][name][about][0][name]." ";
    }
    $post = trim($post);


    $postdata = http_build_query(
        array(
            'q' => $post
        )
    );

    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
        )
    );

    //echo $_SERVER['REQUEST_URI'];

    $server = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']).'/';


    $context  = stream_context_create($opts);
    $result = file_get_contents($server.'wordfrequency.php', false, $context);

   echo $result."<hr>";
    $result2 = file_get_contents($server.'bing-text-analytics.php?q='.urlencode($result));

   // echo $post."<hr>";
    echo $result2;


} else {
 //   print("Invalid Bing Search API subscription key!\n");
 //   print("Please paste yours into the source code.\n");
}
?>