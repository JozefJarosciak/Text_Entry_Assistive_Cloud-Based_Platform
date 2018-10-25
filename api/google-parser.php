<?php
error_reporting(0);

/*
 *
https://www.google.ca/search?num=10&q=isaac+newton+discovered+gravity+at+the+age+of
span.ILfuVd
div.LGOjhe

https://www.google.ca/search?num=10&q=isaac+newton+was%20born%20in%20the%20city%20of
div.kp-hc

https://www.google.ca/search?num=10&q=isaac+newton+died+at+the+age
div.Z0LcW

https://www.google.ca/search?sa=X&q=isaac+newton+inventions
div.title (array)

https://www.google.ca/search?sa=X&q=isaac+newton+siblings
div.title (array)

https://www.google.ca/search?sa=X&q=Toronto+has+a+population+of+
kpd-ans kno-fb-ctx KBXm4e

 */

$q = htmlspecialchars(($_GET["q"]));
$useTor = 0;
$url = "https://www.google.ca/search?num=10&q=".urlencode($q);
//$html = curl_get_contents_partial($url,$useTor,120000);
$html = get_data($url,$useTor);
//echo $html; exit;

//echo $doc;

$dom = new \DOMDocument('1.0');
@$dom->loadHTML($html);



try {
    $b_focusTextLarge = getElementsByClassName($dom, 'LGOjhe', 'div');
    $b_focusTextMedium = getElementsByClassName($dom, 'kp-hc', 'div');
    $df_con = getElementsByClassName($dom, 'Z0LcW', 'div');
    $Z0LcWAZCkJd = getElementsByClassName($dom, 'Z0LcW AZCkJd', 'div');

    $kpdans = getElementsByClassName($dom, 'kpd-ans kno-fb-ctx KBXm4e', 'div');


    $rcExpC =  getElementsByClassName($dom, 'rcExpC', 'div');
    $rcABP =  getElementsByClassName($dom, 'rcABP', 'div');



    $b_secondaryFocus = getElementsByClassName($dom, 'b_secondaryFocus', 'div');
    //$edu_percent_simplepercentcalc_string_result = $dom->getElementById('edu_percent_simplepercentcalc_string_result')->div;

   // $quotesText = getElementsByClassName($dom, 'quotesText', 'div');
} catch (Exception $e) {};

/*
print "<pre>";
print_r( $elementsByClass);
print "</pre>";
*/

//echo $elementsByClass->getAttribute('textContent');

//if ($edu_percent_simplepercentcalc_string_result) { echo $edu_percent_simplepercentcalc_string_result[0]->textContent;}


if ($df_con) {

    $string = str_replace("\xc2\xa0",' ',$df_con[0]->textContent);
   // $string = html_entity_decode($df_con[0]->textContent);
    $content = str_replace('Â', "", $string);
    echo $content;
} else if ($kpdans) {
    $string = str_replace("\xc2\xa0",' ',$kpdans[0]->textContent);
    $content = str_replace('Â', "", $string);
    echo $content;
} else if ($b_focusTextMedium) {
    echo $b_focusTextMedium[0]->textContent;
} else if ($b_focusTextLarge) {
    if ($Z0LcWAZCkJd) {
        echo $Z0LcWAZCkJd[0]->textContent . " - ";
    }
    echo $b_focusTextLarge[0]->textContent;
} else if ($df_con) {
    echo $df_con[0]->textContent;
} else if ($rcABP) {
    echo $rcExpC[0]->textContent."".$rcABP[0]->textContent;
} else if ($b_secondaryFocus) {
    for($i=0; $i<10; $i++){
        if (strlen($b_secondaryFocus[$i]->textContent)>1) {
        echo $b_secondaryFocus[$i]->textContent.", ";
        }
    }
} else if ($quotesText) {
    $quotes = explode(".", ($quotesText[0]->textContent));
    echo $quotes[0].".";
}


function getElementsByID($dom, $ClassName, $tagName=null) {
    if($tagName){
        $Elements = $dom->getElementsByID($tagName);
    }else {
        $Elements = $dom->getElementsByID("*");
    }
    $Matched = array();
    for($i=0;$i<$Elements->length;$i++) {
        if($Elements->item($i)->attributes->getNamedItem('id')){
            if($Elements->item($i)->attributes->getNamedItem('id')->nodeValue == $ClassName) {
                $Matched[]=$Elements->item($i);
            }
        }
    }
    return $Matched;
}

function getElementsByClassName($dom, $ClassName, $tagName=null) {
    if($tagName){
        $Elements = $dom->getElementsByTagName($tagName);
    }else {
        $Elements = $dom->getElementsByTagName("*");
    }
    $Matched = array();
    for($i=0;$i<$Elements->length;$i++) {
        if($Elements->item($i)->attributes->getNamedItem('class')){
            if($Elements->item($i)->attributes->getNamedItem('class')->nodeValue == $ClassName) {
                $Matched[]=$Elements->item($i);
            }
        }
    }
    return $Matched;
}

function xml_to_array($root) {
    $result = array();

    if ($root->hasAttributes()) {
        $attrs = $root->attributes;
        foreach ($attrs as $attr) {
            $result['@attributes'][$attr->name] = $attr->value;
        }
    }

    if ($root->hasChildNodes()) {
        $children = $root->childNodes;
        if ($children->length == 1) {
            $child = $children->item(0);
            if ($child->nodeType == XML_TEXT_NODE) {
                $result['_value'] = $child->nodeValue;
                return count($result) == 1
                    ? $result['_value']
                    : $result;
            }
        }
        $groups = array();
        foreach ($children as $child) {
            if (!isset($result[$child->nodeName])) {
                $result[$child->nodeName] = xml_to_array($child);
            } else {
                if (!isset($groups[$child->nodeName])) {
                    $result[$child->nodeName] = array($result[$child->nodeName]);
                    $groups[$child->nodeName] = 1;
                }
                $result[$child->nodeName][] = xml_to_array($child);
            }
        }
    }

    return $result;
}

function curl_get_contents_partial($url, $useTor, $limit) {
    $writefn = function($ch, $chunk) use ($limit, &$datadump) {
        static $data = '';

        $len = strlen($data) + strlen($chunk);
        if ($len >= $limit) {
            $data .= substr($chunk, 0, $limit - strlen($data));
            $datadump = $data;
            return -1;
        }
        $data .= $chunk;
        return strlen($chunk);
    };

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36');
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);


    if ($useTor==1) {
        curl_setopt($ch, CURLOPT_PROXY, 'http://localhost:9050');
        curl_setopt($ch, CURLOPT_PROXYTYPE, 7);
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_HTTPGET, 1);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_ENCODING, "");
    curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
    curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);


    curl_setopt($ch, CURLOPT_WRITEFUNCTION, $writefn);

    $data = curl_exec($ch);
    curl_close($ch);
    return $datadump;
}


function get_data($url,$useTor) {
    $ch = curl_init();

curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36');
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);
curl_setopt($ch, CURLOPT_HTTPGET, 1);
curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_ENCODING, "");
curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

if ($useTor==1) {
    curl_setopt($ch, CURLOPT_PROXY, 'http://localhost:9050');
    curl_setopt($ch, CURLOPT_PROXYTYPE, 7);
}


$data = curl_exec($ch);
curl_close($ch);
return $data;

}


?>