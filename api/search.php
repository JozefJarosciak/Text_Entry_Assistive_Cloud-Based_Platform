<?php
error_reporting(0);

$path = explode('api', "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
$fullSentence = urldecode(htmlspecialchars(($_GET["s"])));
$space = urldecode(htmlspecialchars(($_GET["space"])));
$transcription = urldecode(htmlspecialchars(($_GET["t"])));
$lastWord = urldecode(htmlspecialchars(($_GET["q"])));
$twoWords = getLastWordsStr($fullSentence, 2);
$threeWords = getLastWordsStr($fullSentence, 3);
$fullSentenceExceptLastWord = rtrim($fullsentence, $lastWord);
$resultArray = array();

if (strlen($lastWord) === strlen($threeWords)) {
    $twoWords = "";
    $threeWords = "";
}
if (strlen($lastWord) === strlen($twoWords)) {
    $twoWords = "";
}
if (strlen($twoWords) === strlen($threeWords)) {
    $threeWords = "";
}

if ($transcription>0) {
    $urlsToProcess = array(
        'http://www.jarosciak.com/textentry/api/dictionary.php?q='.$lastWord.'&f=0&c=10',
        'http://www.jarosciak.com/textentry/api/dictionary.php?q='.$lastWord.'&f=1&c=10',
    );
} else {
    $urlsToProcess = array(
        'http://www.jarosciak.com/textentry/api/dictionary.php?q='.$lastWord.'&f=0',
        'http://www.jarosciak.com/textentry/api/dictionary.php?q='.$lastWord.'&f=1',
        $path[0].'api/wikipedia-suggest.php?q=%' . urlencode($lastWord),
        $path[0].'api/wikipedia-suggest.php2?q=%' . urlencode($lastWord),
        $path[0].'api/google-suggestqueries.php?q=' . urlencode($lastWord),
        $path[0].'api/wikipedia-suggest.php?q=%' . urlencode($twoWords),
        //$path[0].'api/amazon-autosuggest.php?q=' . urlencode($lastWord),
        //$path[0].'api/google-suggestqueries.php?q=' . urlencode($twoWords),
        //$path[0].'api/bing-autosuggest.php?q=' . urlencode($twoWords),
    );
}


if ($space==0) {
    $resultArray = multiRequest($urlsToProcess);
}

foreach ($resultArray as $key=>&$value) {
    if (strlen($value) <= 2) {
        unset($resultArray[$key]);
    }

    if (strtolower(substr($lastWord, 0, 1)) !== strtolower(substr(remove_accents(urldecode($value)), 0, 1))) {
        unset($resultArray[$key]);
    }

    if (strpos($value, ' meaning') !== false) {$value = trim(str_ireplace(" meaning","",$value));}
    if (strpos($value, ' definition') !== false) {$value = trim(str_ireplace(" definition","",$value));}
    if (strpos($value, ' weather') !== false) {$value = trim(str_ireplace(" weather","",$value));}
    if (strpos($value, ' synonym') !== false) {$value = trim(str_ireplace(" synonym","",$value));}

    if (preg_match('#^\p{Lu}#u', $lastWord) == true) {
        $value = ucwords($value);
    }

    if (substr_count($value, ' ') > 0) {
        $arr = array();
        $arr = explode(' ', trim($fullSentence));

        for($i = 0, $l = count($arr); $i < $l; ++$i) {
            if ($arr[$i+1]) {
                $arr2=array();
                $arr2 = explode(' ', trim($value));

                for($ii = 0, $ll = count($arr2); $ii < $ll; ++$ii) {
                    if (strtolower($arr[$i]) === strtolower($arr2[$ii])) {
                        if (strpos(strtolower($value), strtolower($arr[$i])) === 0) {
                            $result = trim(substr($value, -1 * abs((strlen($value) - trim(strlen($arr[$i]))))));
                            $value = $result;
                        }
                    }
                }
            }
        }
    }
}



if ($space>0) {
    //echo "sdfgsdg";
//echo $fullSentence."|<br>";
$server = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']).'/';
$url = $server . "bing-parser.php?q=" . $fullSentence;
//print $url;
$bingParser = " ";

$doc = new DOMDocument();
$doc->loadHTMLFile($url);
$xpath = new DOMXPath($doc);
foreach($xpath->query("//script") as $script) {
    $script->parentNode->removeChild($script);
}
$textContent = $doc->textContent;
$bingParser = $textContent;

if (strlen($bingParser) > 1) {
    $pieces = explode(' ', trim($fullSentence));
    $last_word = array_pop($pieces);
    $last_word = trim($last_word, ';');
    $bingParser = str_replace('Â', "", $bingParser);
    $bingParser = str_replace("\xc2\xa0",' ',$bingParser);
    array_push($resultArray," ".$bingParser." ");
}
}

$trimmedArray = array_map('trim', $resultArray);
$result = array_filter($trimmedArray);
$result = array_unique($result);
$result = array_diff($result, [$lastWord]);

echo json_encode($result);

function str_replace_once($str_pattern, $str_replacement, $string)
{

    if (strpos($string, $str_pattern) !== false) {
        $occurrence = strpos($string, $str_pattern);
        return substr_replace($string, $str_replacement, strpos($string, $str_pattern), strlen($str_pattern));
    }

    return $string;
}

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


function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}


function removeCommonWords($input)
{
    $commonWords = array('known','know','and', 'also', 'like', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'need', 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't");
    return preg_replace('/\b(' . implode('|', $commonWords) . ')\b/', '', $input);
}

function in_arrayi($needle, $haystack)
{
    return in_array(strtolower($needle), array_map('strtolower', $haystack));
}



function multiRequest($data, $options = array()) {
    $curly = array();
    $result = array();
    $mh = curl_multi_init();
    foreach ($data as $id => $d) {
        $curly[$id] = curl_init();
        $url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;
        curl_setopt($curly[$id], CURLOPT_URL,            $url);
        curl_setopt($curly[$id], CURLOPT_HEADER,         0);
        curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);
        if (is_array($d)) {
            if (!empty($d['post'])) {
                curl_setopt($curly[$id], CURLOPT_POST,       1);
                curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $d['post']);
            }
        }
        if (!empty($options)) {
            curl_setopt_array($curly[$id], $options);
        }
        curl_multi_add_handle($mh, $curly[$id]);
    }

    $running = null;
    do {
        curl_multi_exec($mh, $running);
    } while($running > 0);

    foreach($curly as $id => $c) {
        $result[$id] = curl_multi_getcontent($c);
        curl_multi_remove_handle($mh, $c);
    }
    curl_multi_close($mh);
    return $result;
}

function remove_accents($string) {
    if ( !preg_match('/[\x80-\xff]/', $string) )
        return $string;
       $chars = array(
        chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
        chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
        chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
        chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
        chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
        chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
        chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
        chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
        chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
        chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
        chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
        chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
        chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
        chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
        chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
        chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
        chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
        chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
        chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
        chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
        chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
        chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
        chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
        chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
        chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
        chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
        chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
        chr(195).chr(191) => 'y',
        chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
        chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
        chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
        chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
        chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
        chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
        chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
        chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
        chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
        chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
        chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
        chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
        chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
        chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
        chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
        chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
        chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
        chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
        chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
        chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
        chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
        chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
        chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
        chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
        chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
        chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
        chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
        chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
        chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
        chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
        chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
        chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
        chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
        chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
        chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
        chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
        chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
        chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
        chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
        chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
        chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
        chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
        chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
        chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
        chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
        chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
        chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
        chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
        chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
        chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
        chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
        chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
        chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
        chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
        chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
        chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
        chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
        chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
        chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
        chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
        chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
        chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
        chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
        chr(197).chr(190) => 'z', chr(197).chr(191) => 's'
    );

    $string = strtr($string, $chars);

    return $string;
}
?>