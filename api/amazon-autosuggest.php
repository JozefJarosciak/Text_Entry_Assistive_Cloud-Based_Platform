<?php
error_reporting(0);


$q = htmlspecialchars(($_GET["q"]));

$url = 'https://completion.amazon.com/search/complete?method=completion&search-alias=aps&client=amazon-search-ui&mkt=1&q=' . urlencode($q);
$json = file_get_contents($url);


print "<pre>";
print_r($json);
print "</pre>";

$data = json_decode($json, true);

try {
    if ($data) {
        if ($data['query']['search'][0]['title']) {
            $result = $data['query']['search'][0]['title'];
            echo $result;
        }
    }
} catch (Exception $e) {
}

?>
