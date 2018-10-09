<?php

$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));

$url_google = 'http://suggestqueries.google.com/complete/search?output=firefox&client=firefox&hl=en&q='.urlencode($q).'';
$curl = get_data($url_google);
$array = json_decode($curl, true);
//sort($array[1]);

foreach($array[1] as $result)
{
   // echo urldecode($q) . " - ";
    if (substr($result, 0, strlen(urldecode($q))) === urldecode($q)) {
    echo $result;
        echo "|";
    }


}

/*
print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
print_r($json_from_curl);
print "</pre>\n";
*/

function get_data($url) {

    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    $ch = curl_init();
    $timeout = 5;
    curl_setopt ($ch, CURLOPT_URL, $url);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($ch, CURLOPT_USERAGENT, $user_agent);
    curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}


?>