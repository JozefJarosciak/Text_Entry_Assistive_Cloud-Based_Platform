<?php
error_reporting(0);
$q = urldecode(htmlspecialchars(mb_strtolower(($_GET["q"]))));

$url_google = 'https://suggestqueries.google.com/complete/search?output=toolbar&client=chrome&hl=en&q='.urlencode($q).'';
$curl = get_data($url_google);
$array = json_decode($curl, true);
//echo $curl;
//sort($array[1]);


/*
$arraynew = [];

foreach($array[1] as $result)
{

$i++;
if ($i<=1) {
   // echo $result."|";
   array_push ($arraynew,$result);
}
}

$arraynew = json_encode($arraynew);
echo $arraynew;

print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";

print "</pre>\n";

echo "<hr>";
*/
//print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
//( $array[1]);
//print "</pre>\n";

echo $array[1][0];

//echo "<hr>".$arraynew;
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