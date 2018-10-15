<?php
error_reporting(0);

//echo "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"."<br>";
$path = explode('api', "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
//echo $path[0];

$fullSentence = urldecode(htmlspecialchars(($_GET["s"])));
//$fullSentence = removeCommonWords($fullSentence);
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

//echo "$lastWord -- $twoWords -- $threeWords<br><br>";

//'http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=%' . urlencode($threeWords),
//'http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=' . urlencode($threeWords),

$urlsToProcess = array(
    'http://www.jarosciak.com/textentry/api/dictionary.php?q='.$lastWord,
    $path[0].'api/google-suggestqueries.php?q=' . urlencode($lastWord),
    $path[0].'api/wikipedia-suggest.php?q=%' . urlencode($lastWord),
    $path[0].'api/wikipedia-suggest.php?q=%' . urlencode($twoWords),
    $path[0].'api/wikipedia-suggest.php?q=' . urlencode($lastWord),
    $path[0].'api/wikipedia-suggest.php?q=' . urlencode($twoWords),
    $path[0].'api/google-suggestqueries.php?q=' . urlencode($twoWords),
);
$resultArray = multiRequest($urlsToProcess);
//print_r( $resultArray);
foreach ($resultArray as $key=>&$value) {
    if (strlen($value) <= 2) {
        unset($resultArray[$key]);
    }

    //echo "$value - ". ucwords($value). "<br>";
    if (preg_match('#^\p{Lu}#u', $lastWord) == true) {

        $value = ucwords($value);
    }

    if (substr_count($value, ' ') > 0) {

        //$positionOfExistingFullSentenceInTheResult = stripos($arr[0],$value);
        //$result = substr($value, ($positionOfExistingFullSentenceInTheResult + strlen($arr[0])) );
       /*

       */
        $arr = array();
        $arr = explode(' ', trim($fullSentence));



       // if (startsWith($result,$arr[0])==true){

        for($i = 0, $l = count($arr); $i < $l; ++$i) {
            if ($arr[$i+1]) {
                $arr2=array();
                $arr2 = explode(' ', trim($value));
                for($ii = 0, $ll = count($arr2); $ii < $ll; ++$ii) {
                    //echo strtolower($arr[$i]) . " - " . strtolower($arr2[$ii]) . " - $value<br>";
                    if (strtolower($arr[$i]) === strtolower($arr2[$ii])) {


                        if (strpos(strtolower($value), strtolower($arr[$i])) === 0) {
                            $result = trim(substr($value, -1 * abs((strlen($value) - trim(strlen($arr[$i]))))));
                            $value = $result;
                        }
                      //  echo strtolower(substr($value, 0, strlen($arr[$i]))) . " === " . $strtolower($arr2[$ii]) . " - $value<br>";
                       // if (strtolower(substr($arr2[$ii], 0, strlen($arr[$i]))) === $strtolower($arr2[$ii])) {

                        //}
                    }
                }


                //$result = trim(str_replace(strtolower($arr[$i]), '', $strtolower($arr2[$i])));




            }

        }
       // echo "<br><br>";

        //}

      //  echo "$arr[0] - $value - $result<br>";
        //unset($resultArray[$key]);
        //array_push($resultArray, $result);
    }

}
/*
echo "dictionarySuggestLastWord1 -> '$resultArray[0]' <br>";
//echo "wikiSuggestThreeWords -> '$resultArray[1]' <br>";
echo "wikiSuggestTwoWords -> '$resultArray[2]' <br>";
echo "wikiSuggestLastWord -> '$resultArray[3]' <br>";
//echo "googleSuggestThreeWords -> $threeWords -> '$resultArray[4]' <br>";
echo "googleSuggestTwoWords -> '$resultArray[5]' <br>";
echo "googleSuggestLastWord -> '$resultArray[6]' <br>";
*/

/*



// DICTIONARY SUGGEST LAST WORD
$dictionaryWord = file_get_contents('http://www.jarosciak.com/textentry/api/dictionary.php?q=' . $lastWord);
$dictionarySuggestLastWord = explode("|", $dictionaryWord);
if ($dictionarySuggestLastWord[0]) {
    array_push($resultArray, $dictionarySuggestLastWord[0]);
}
if ($dictionarySuggestLastWord[1]) {
    array_push($resultArray, $dictionarySuggestLastWord[1]);
}


// WIKIPEDIA SUGGEST LAST 3 WORDS
if (strlen($threeWords) > 0) {
    $threeWords = removeCommonWords($threeWords);
    $wikiSuggestThreeWords = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=%' . urlencode($threeWords));
    //$positionOfExistingFullSentenceInTheResult = stripos($wikiSuggestThreeWords, $threeWords);
   // $wikiSuggestThreeWords = substr($wikiSuggestThreeWords, ($positionOfExistingFullSentenceInTheResult + strlen($threeWords)) - (strlen($lastWord) + 1));
    //echo "$threeWords -> $wikiSuggestThreeWords<br>";
    array_push($resultArray, $wikiSuggestThreeWords);
}


// WIKIPEDIA SUGGEST LAST TWO WORDS IF LAST 3 WORDS WERE NOT FOUND
if (strlen($wikiSuggestThreeWords) < 1) {
    //echo strlen($wikiSuggestThreeWords)."<br>";
    if (strlen($twoWords) > 0) {
        $wikiSuggestTwoWords = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=%' . urlencode($twoWords));
        $arr = explode(' ', trim($twoWords));
        $wikiSuggestTwoWords = trim(str_replace_once($arr[0], '', $wikiSuggestTwoWords, 1));
        $wikiSuggestTwoWords = trim(str_replace_once(strtolower($arr[0]), '', $wikiSuggestTwoWords, 1));
        $wikiSuggestTwoWords = trim(str_replace_once(ucwords($arr[0]), '', $wikiSuggestTwoWords, 1));
        $wikiSuggestTwoWords = trim(str_replace_once(strtoupper($arr[0]), '', $wikiSuggestTwoWords, 1));
        if (startsWith($wikiSuggestTwoWords, 'y ') === true) {
            $wikiSuggestTwoWords = str_replace_once('y ', '', $wikiSuggestTwoWords);
        }
        array_push($resultArray, $wikiSuggestTwoWords);
    }
}


// WIKIPEDIA SUGGEST LAST WORD
//if (strlen($wikiSuggestThreeWords)<1) {
//if (!$wikiSuggestTwoWords) {
$wikiSuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=%' . urlencode($lastWord));
array_push($resultArray, $wikiSuggestLastWord);
//}
//}


// GOOGLE SUGGEST - LAST 3 WORDS
if (strlen($wikiSuggestThreeWords) < 1) {
    if (strlen($threeWords) > 0) {
        // only search if sentence has no more than 5 words
        if (substr_count($fullsentence, ' ') <= 5) {
            $threeWords = removeCommonWords($threeWords);
            $googleSuggestThreeWords = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=' . urlencode($threeWords));
           // $positionOfExistingFullSentenceInTheResult = stripos($googleSuggestThreeWords, $threeWords);
           // $googleSuggestThreeWords = substr($googleSuggestThreeWords, ($positionOfExistingFullSentenceInTheResult + strlen($threeWords)) - (strlen($lastWord) + 1));

            if (in_arrayi(strtolower($googleSuggestThreeWords), $resultArray)) {
            } else {
                array_push($resultArray, $googleSuggestThreeWords);
            }

        }
    }
}

// GOOGLE SUGGEST LAST TWO WORDS
if (strlen($wikiSuggestThreeWords) < 1) {
    if (strlen($wikiSuggestTwoWords) < 1) {
        if (strlen($googleSuggestThreeWords) < 1) {
            if (strlen($twoWords) > strlen($lastWord)) {
                $googleSuggestTwoWords = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=' . urlencode($twoWords));
                $arr = explode(' ', trim($twoWords));
                $googleSuggestTwoWords = trim(str_replace_once($arr[0], '', $googleSuggestTwoWords, 1));
                $googleSuggestTwoWords = trim(str_replace_once(strtolower($arr[0]), '', $googleSuggestTwoWords, 1));
                $googleSuggestTwoWords = trim(str_replace_once(ucwords($arr[0]), '', $googleSuggestTwoWords, 1));
                $googleSuggestTwoWords = trim(str_replace_once(strtoupper($arr[0]), '', $googleSuggestTwoWords, 1));

                if (in_arrayi(strtolower($googleSuggestTwoWords), $resultArray)) {
                } else {
                    array_push($resultArray, $googleSuggestTwoWords);
                }

            }
        }
    }
}


// GOOGLE SUGGEST LAST WORD
//if (strlen($wikiSuggestThreeWords) < 1) {
  //  if (strlen($wikiSuggestTwoWords) < 1) {
        //if (strlen($wikiSuggestLastWord) < 1) {
    //        if (strlen($googleSuggestTwoWords) < 1) {
                $googleSuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/google-suggestqueries.php?q=' . $lastWord);
                //$positionOfExistingFullSentenceInTheResult = stripos($wikiSuggestThreeWords, $lastWord);
                //$wikiSuggestThreeWords = substr($wikiSuggestThreeWords, ($positionOfExistingFullSentenceInTheResult + strlen($threeWords) + 1) - (strlen($lastWord) + 1));
                if (in_arrayi(strtolower($googleSuggestLastWord), $resultArray)) {
                } else {
                    array_push($resultArray, $googleSuggestLastWord);
                }
        //    }
       // }
    //}
//}

*/



// debug




/*
if (strtolower($dictionarySuggestLastWord[0]) === strtolower($googleSuggestTwoWords)) {
    // GOOGLE/WIKI LAST TWO WORDS RESULTS
    if (strtolower($googleSuggestTwoWords) === strtolower($wikiSuggestTwoWords)) {
        array_push($resultArray, $wikiSuggestTwoWords);
    } else {
        if (substr($wikiSuggestTwoWords, 0, 2) === "y ") {
            $wikiSuggestTwoWords = substr($wikiSuggestTwoWords, 2);
            array_push($resultArray, $wikiSuggestTwoWords);
        } else {
            array_push($resultArray, $wikiSuggestTwoWords);
        }
        array_push($resultArray, $googleSuggestTwoWords);
    }
} else {
    // DICTIONARY RESULT
    if ($dictionarySuggestLastWord[0]) {
        array_push($resultArray, $dictionarySuggestLastWord[0]);
    }
}

/*
echo "googleSuggestTwoWords -> $googleSuggestTwoWords <br>";
echo "wikiSuggestTwoWords -> $wikiSuggestTwoWords <br>";
echo "googleSuggestLastWord 1 -> $googleSuggestLastWord <br>";



// GOOGLE LAST WORD SUGGESTIONS
if (strtolower($googleSuggestLastWord) === strtolower($wikiSuggestLastWord)) {
    array_push($resultArray, $wikiSuggestLastWord);
} else {
    $wikiSuggestLastWord = file_get_contents('http://www.jarosciak.com/textentry/api/wikipedia-suggest.php?q=' . urlencode($googleSuggestLastWord));
    //echo "<hr>2 - > $googleSuggestLastWord -> $wikiSuggestLastWord";
    if (strtolower($googleSuggestLastWord) === strtolower($wikiSuggestLastWord)) {
        array_push($resultArray, $wikiSuggestLastWord);
    } else {
        array_push($resultArray, $googleSuggestLastWord);
        array_push($resultArray, $wikiSuggestLastWord);
    }
}


if (strtolower(substr($googleSuggestThreeWords, 0, strlen($lastWord))) === strtolower($lastWord)) {
    array_push($resultArray, $googleSuggestThreeWords);
}
*/
/*
echo "dictionarySuggestLastWord[0] -> $dictionarySuggestLastWord[0] <br>";
echo "wikiSuggestLastWord 2 -> $wikiSuggestLastWord <br>";
echo "googleSuggestSentence -> $googleSuggestThreeWords <br>";
*/


//array_push($resultArray, ucwords($wikiSuggestLastWord));


//$resultArray2 = array_merge($resultArray[0], $resultArray[1]);
//$resultArray2 = call_user_func_array('array_merge', $resultArray);

//print "<pre style=\"margin:16px 8px; padding:4px; text-align:left; background:#DEDEDE; color:#000099;\">\n";
$trimmedArray = array_map('trim', $resultArray);
$result = array_filter($trimmedArray);
$result = array_unique($result);


$result = array_diff($result, [$lastWord]);

/*
usort($result, function($a, $b) {
    return strlen($b) <=> strlen($a);
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