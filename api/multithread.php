<?php
// At start of script

$time_start = microtime(true);

$data = array(
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=arnold',
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=cannon',
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=weather',
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=bath',
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=switch',
    'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=simul',
    'http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=cannon'
);
$r = multiRequest($data);

echo '<pre>';
print_r($r);

echo 'Total execution time in seconds: ' . (microtime(true) - $time_start);

$r = [];
$time_start = microtime(true);
$url = shell_exec('php '.__DIR__.'/google-suggestqueries.php?q=arnold'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=cannon'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=weather'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=bath'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=switch'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=simul'); array_push($r, $url );
$url = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=cannon'); array_push($r, $url );

echo '<pre>';
print_r($r);

echo '<hr>Total execution time in seconds: ' . (microtime(true) - $time_start);


function multiRequest($data, $options = array()) {

// array of curl handles
$curly = array();
// data to be returned
$result = array();

// multi handle
$mh = curl_multi_init();

// loop through $data and create curl handles
// then add them to the multi-handle
foreach ($data as $id => $d) {

$curly[$id] = curl_init();

$url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;
curl_setopt($curly[$id], CURLOPT_URL,            $url);
curl_setopt($curly[$id], CURLOPT_HEADER,         0);
curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);

// post?
if (is_array($d)) {
if (!empty($d['post'])) {
curl_setopt($curly[$id], CURLOPT_POST,       1);
curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $d['post']);
}
}

// extra options?
if (!empty($options)) {
curl_setopt_array($curly[$id], $options);
}

curl_multi_add_handle($mh, $curly[$id]);
}

// execute the handles
$running = null;
do {
curl_multi_exec($mh, $running);
} while($running > 0);


// get content and remove handles
foreach($curly as $id => $c) {
$result[$id] = curl_multi_getcontent($c);
curl_multi_remove_handle($mh, $c);
}

// all done
curl_multi_close($mh);

return $result;
}

?>