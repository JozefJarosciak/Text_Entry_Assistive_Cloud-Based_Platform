<?php

$q = htmlspecialchars(($_GET["q"]));

$url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srnamespace=0&srprop=snippet&format=json&callback=json&origin=*&prop=links|extracts|categories|images&srsearch=test';
$json = file_get_contents($url);

/*
print "<pre>";print_r($json);print "</pre>";
*/

$data = json_decode($json,true);
echo $data['query']['search'][0]['title'];



//

/*
print "<pre>";
print_r($json);
print "</pre>";
*/

/*
$titles = array();
foreach ($json[query] as $page) {
    $titles[] = $page[search][0][title];
    echo $page[search][0][title];
}
*/


?>