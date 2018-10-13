<?php
$q = urldecode(htmlspecialchars(($_GET["q"])));




$s = urldecode(htmlspecialchars(($_GET["s"])));
//echo $q." - ".$s . " = ";echo strlen($q)." - ".strlen($s)."<br>";
//$resultArray = [];
$resultArray = array();

$s = getLastWordsStr($s,2);

if (strlen($s) >  strlen($q)) {
    $googleSuggestSentence = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q='.urlencode($s));
    // Get the first word

    $arr = explode(' ',trim($s));
    //  echo $s." - ".$arr[0]."<hr>";
    $googleSuggestSentence = trim (str_replace_once($arr[0], '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(strtolower($arr[0]), '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(ucwords($arr[0]), '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(strtoupper($arr[0]), '', $googleSuggestSentence, 1));

    array_push($resultArray, $googleSuggestSentence);
    array_push($resultArray, ucwords($googleSuggestSentence));
}

if (strlen($s) >  strlen($q)) {
    $googleSuggestSentence = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q='.urlencode($s));
    // Get the first word

    $arr = explode(' ',trim($s));
    //  echo $s." - ".$arr[0]."<hr>";
    $googleSuggestSentence = trim (str_replace_once($arr[0], '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(strtolower($arr[0]), '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(ucwords($arr[0]), '', $googleSuggestSentence, 1));
    $googleSuggestSentence = trim (str_replace_once(strtoupper($arr[0]), '', $googleSuggestSentence, 1));

    array_push($resultArray, $googleSuggestSentence);
    array_push($resultArray, ucwords($googleSuggestSentence));
}

$dictionarySuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/dictionary.php?q='.$q);
//echo $dictionarySuggestLastWord;
$pieces = explode("|", $dictionarySuggestLastWord);
if ($pieces[0]) {array_push($resultArray, $pieces[0]);}
//if ($pieces[1]) {array_push($resultArray, $pieces[1]);}
//if ($pieces[2]) {array_push($resultArray, $pieces[2]);}

$googleSuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q='.$q);
array_push($resultArray, $googleSuggestLastWord);
array_push($resultArray, ucwords($googleSuggestLastWord));

$googleSuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q='.$q);
array_push($resultArray, $googleSuggestLastWord);
array_push($resultArray, ucwords($googleSuggestLastWord));




//$resultArray2 = array_merge($resultArray[0], $resultArray[1]);
//$resultArray2 = call_user_func_array('array_merge', $resultArray);

//print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
$trimmedArray = array_map('trim', $resultArray);
$emptyRemoved = array_filter($trimmedArray);
$result = array_unique($emptyRemoved);
$result = array_diff($result, [$q]);

/*
usort($result, function($a, $b) {
    return strlen($a) - strlen($b) ?: strcmp($a, $b);
});
*/

//sort($result);
//print_r( $result);
//print "</pre>\n";


/*
$trimmedArray = array_map('trim', $arrayFinal);
$emptyRemoved = array_filter($trimmedArray);
$result = array_unique($emptyRemoved);

print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
print_r( $result);
print "</pre>\n";
*/


echo json_encode($result);


function str_replace_once($str_pattern, $str_replacement, $string){

    if (strpos($string, $str_pattern) !== false){
        $occurrence = strpos($string, $str_pattern);
        return substr_replace($string, $str_replacement, strpos($string, $str_pattern), strlen($str_pattern));
    }

    return $string;
}

function getLastWordsStr($text,$numWords=1) {
    $nonWordChars = ':;,.?![](){}*';
    $result = '';
    $words = explode(' ',$text);
    $wordCount = count($words);
    if ($numWords > $wordCount) {
        $numWords = $wordCount;
    }
    for ($w = $numWords; $w > 0; $w--) {
        if (!empty($result)) {$result .= ' ';}
        $result .= trim($words[$wordCount - $w], $nonWordChars);
    }
    return $result;
}

?>