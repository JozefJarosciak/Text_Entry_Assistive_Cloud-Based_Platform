<?php
error_reporting(0);
// this file has reference to '$subscriptionKey' variable that needs to hold the Microsoft API key
include("credentials.php");


$q = htmlspecialchars(mb_strtolower(($_GET["q"])));

//$q = getLastWordsStr($q,2);

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.



$host = "https://api.labs.cognitive.microsoft.com";
$path = "/answersearch/v7.0/search";

$mkt = "en-US";
$query = urlencode("site:wikipedia.org ".$q);

$count=1;
$offset=0;
$safesearch="Moderate";


function get_suggestions ($host, $path, $subscriptionKeyAnswer, $mkt, $count, $offset, $safesearch, $query) {

    $params = '?mkt=' . $mkt . '&count=' . $count. '&offset=' . $offset. '&safesearch=' . $safesearch. '&q=' . $query;

    $headers = "Content-type: text/json\r\n" .
        "Ocp-Apim-Subscription-Key: $subscriptionKeyAnswer\r\n";

    // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
    // http://php.net/manual/en/function.stream-context-create.php
    $options = array (
        'http' => array (
            'header' => $headers,
            'method' => 'GET'
        )
    );
    $context  = stream_context_create ($options);
    $result = file_get_contents ($host . $path . $params, false, $context);
    return $result;
}

$result = get_suggestions ($host, $path, $subscriptionKeyAnswer, $mkt, $count, $offset, $safesearch, $query);
$result = json_encode(json_decode ($result), JSON_PRETTY_PRINT);

$data = json_decode($result, true);
//echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);


// NAME
if ($data[webPages][value][0][name]){
    echo '<b><a href="'.$data[webPages][value][0][url].'" target="_blank">';
    $nameofurl = str_ireplace(" - Wikipedia","",trim($data[webPages][value][0][name]));
    $nameofurl = str_ireplace(" - IMDb","",$nameofurl);
    $nameofurl = str_ireplace(" - Official Site","",$nameofurl);
    $nameofurl1 = explode("::", $nameofurl);
    $nameofurlfin = explode("|", $nameofurl1[0]);

    echo trim($nameofurlfin[0]). "</a></b>";
    echo " - ";
} else if ($data[webPages][value][0][about][0][name]) {
    echo "<b>";
  //  echo '<a href="'.$data[webPages][value][0][url].'" target="_blank">';
    echo strtoupper($data[webPages][value][0][about][0][name]). "</b>";
    echo " - ";
} else if ($data[entities][value][0][name]){
    echo "<b>";
   // echo '<a href="'.$data[webPages][value][0][url].'" target="_blank">';
    echo strtoupper($data[entities][value][0][name]).  "</b>";
    echo " - ";
}

if ($data[facts][value][0][description]) {
    echo $data[facts][value][0][description]. "... ";
}


// SNIPPET
if ($data[entities][value][0][description]) {
echo $data[entities][value][0][description]. "... ";
} else {
echo $data[webPages][value][0][snippet]. "... ";
//echo  "|" . $data[webPages][value][0][displayUrl] . "<br>";
}

// RICH CAPTIONS
$numRichCaptions = count($data[webPages][value][0][richCaption][rows]);
if ($numRichCaptions>0) {echo "<b>Suggestions: </b>";}
for ($i = 0; $i < $numRichCaptions; $i++) {
    echo '<a href="'.$data[webPages][value][0][richCaption][rows][$i][cells][0][url].'" target="_blank">'.$data[webPages][value][0][richCaption][rows][$i][cells][0][text].'</a>';
    echo ' - '.$data[webPages][value][0][richCaption][rows][$i][cells][1][text];
    if ($i>=2) {echo '.';break;} else {echo ' ; ';}
}

if ($numRichCaptions>0) {echo "<br>";}

echo "<br>";

// DEEP LINKS
$numDeepLinks = count($data[webPages][value][0][deepLinks]);
if ($numDeepLinks>0) {echo "<br><b>Deep Links: </b>";}
for ($i = 0; $i < $numDeepLinks; $i++) {
    if ($i==3) {break;}
    echo '<br><a href="'.$data[webPages][value][0][deepLinks][$i][url].'" target="_blank">'.$data[webPages][value][0][deepLinks][$i][name].'</a>';
    if ($data[webPages][value][0][deepLinks][$i][snippet]) {
    echo  " - " .$data[webPages][value][0][deepLinks][$i][snippet];
    }
    //if ($i>=2) {echo '.';break;} else {echo ' ; ';}
}



/*

print "<pre>";
print_r ( $data);
print "</pre>";
*/


function getLastWordsStr($text, $numWords = 1)
{
    $nonWordChars = ':;,.?![](){}*';
    $result = '';
    $words = explode(' ', $text);
    $wordCount = count($words);
    if ($numWords > $wordCount) {
        $numWords = $wordCount;
    }
    for ($w = $numWords; $w > 0; $w--) {
        if (!empty($result)) {
            $result .= ' ';
        }
        $result .= trim($words[$wordCount - $w], $nonWordChars);
    }
    return $result;
}

?>