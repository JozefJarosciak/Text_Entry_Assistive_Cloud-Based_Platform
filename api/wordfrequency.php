<?php
error_reporting(0);


$data = htmlspecialchars(($_POST["q"]));

//$data = 'Ottawa - Wikipedia Ottawa is the Ottawa capital Ottawa-bb city of the the Canada. It stands on the south bank of the Ottawa River ... O Origin of the names of Canada’s provincial and territorial ... Origin of the names of Canada’s provincial and territorial capitals. Ottawa, Canada; ... The city adopted its name from ... It became the capital of the Northwest ... O Capital Cities of Canada - ThoughtCo Canada has 10 provinces and three territories, each with its own capital. Here are quick facts about the history and lifestyle of each. C';
$data = removeCommonWords($data);
//$data = preg_replace("/[^[:alnum:][:space:]]/u", '', $data);
$data = preg_replace('/[^ \w-]/', '', $data);

//echo $data."<hr>";



$words = explode(' ',$data);
$finArray = array_count_values($words);
arsort($finArray);

foreach ($finArray as $key=>&$value) {
    if (strlen($key) <= 3) {
        unset($finArray[$key]);
    }
}

/*
print "<pre>";
print_r( $finArray );
print "</pre>";
*/



$sentence = "";
$ii=0;
foreach($finArray as $key => $val) {
    $ii++;
    if ($ii<=6) {
        if (strlen(trim($key))>0) {
        $sentence .= trim($key)." ";
        }
    }
}

echo trim($sentence);


function removeCommonWords($input){
    $stopwords = array(
        'a',
        'about',
        'same',
        'SAME',
        'Wikipedia',
        'Google',
        'wikipedia',
        'above',
        'after',
        'again',
        'against',
        'all',
        'am',
        'an',
        'and',
        'any',
        'are',
        "aren't",
        'as',
        'at',
        'be',
        'because',
        'been',
        'before',
        'being',
        'below',
        'between',
        'both',
        'but',
        'by',
        "can't",
        'cannot',
        'could',
        "couldn't",
        'did',
        "didn't",
        'do',
        'does',
        "doesn't",
        'doing',
        "don't",
        'down',
        'during',
        'each',
        'few',
        'for',
        'from',
        'further',
        'had',
        "hadn't",
        'has',
        "hasn't",
        'have',
        "haven't",
        'having',
        'he',
        "he'd",
        "he'll",
        "he's",
        'her',
        'here',
        "here's",
        'hers',
        'herself',
        'him',
        'himself',
        'his',
        'how',
        "how's",
        'i',
        "i'd",
        "i'll",
        "i'm",
        "i've",
        'if',
        'in',
        'into',
        'is',
        "isn't",
        'it',
        "it's",
        'its',
        'itself',
        "let's",
        'me',
        'more',
        'most',
        "mustn't",
        'my',
        'myself',
        'no',
        'nor',
        'not',
        'of',
        'off',
        'on',
        'once',
        'only',
        'or',
        'other',
        'ought',
        'our',
        'ours',
        'ourselves',
        'out',
        'over',
        'own',
        'same',
        "shan't",
        'she',
        "she'd",
        "she'll",
        "she's",
        'should',
        "shouldn't",
        'so',
        'some',
        'such',
        'than',
        'that',
        "that's",
        'the',
        'their',
        'theirs',
        'them',
        'themselves',
        'then',
        'there',
        "there's",
        'these',
        'they',
        "they'd",
        "they'll",
        "they're",
        "they've",
        'this',
        'those',
        'through',
        'to',
        'too',
        'under',
        'until',
        'up',
        'very',
        'was',
        "wasn't",
        'we',
        "we'd",
        "we'll",
        "we're",
        "we've",
        'were',
        "weren't",
        'what',
        "what's",
        'when',
        "when's",
        'where',
        "where's",
        'which',
        'while',
        'who',
        "who's",
        'whom',
        'why',
        "why's",
        'with',
        "won't",
        'would',
        "wouldn't",
        'you',
        "you'd",
        "you'll",
        "you're",
        "you've",
        'your',
        'yours',
        'yourself',
        'yourselves',
        'zero'
    );
    return preg_replace('/\b('.implode('|',$stopwords).')\b/','',$input);
}




?>