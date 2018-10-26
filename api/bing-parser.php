<?php
error_reporting(0);


$q = htmlspecialchars(($_GET["q"]));
$useTor = 0;
$url = "https://www.bing.com/search?q=".urlencode($q)."%20";
//echo $url; exit;
//$html = curl_get_contents_partial($url,$useTor,120000);
$html = get_data($url,$useTor);
//echo $html; exit;

//echo $doc;

$dom = new \DOMDocument('1.0');
@$dom->loadHTML($html);



try {
    $b_focusTextLarge = getElementsByClassName($dom, 'b_focusTextMedium', 'div');
    $b_focusTextMedium = getElementsByClassName($dom, 'b_focusTextMedium', 'div');
    $b_focusTextLarge = getElementsByClassName($dom, 'b_focusTextLarge', 'div');
    $rcExpC =  getElementsByClassName($dom, 'rcExpC', 'div');
    $rcABP =  getElementsByClassName($dom, 'rcABP', 'div');
    $df_con = getElementsByClassName($dom, 'rwrl rwrl_pri rwrl_padref', 'div');
    $b_secondaryFocus = getElementsByClassName($dom, 'b_secondaryFocus', 'div');
    $wob_t = getElementsByClassName($dom, 'wtr_currTemp b_focusTextLarge', 'div'); // temperature


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

if ($wob_t) {
   echo $wob_t[0]->textContent . "°F ";
}

if ($df_con) {
    echo $df_con[0]->textContent;
}

if ($b_focusTextMedium) {
    echo $b_focusTextMedium[0]->textContent;
}

if ($b_focusTextLarge) {
    echo $b_focusTextLarge[0]->textContent;
}

if ($rcABP) {
    echo $rcExpC[0]->textContent."".$rcABP[0]->textContent;
}

if ($b_secondaryFocus) {
    for($i=0; $i<10; $i++){
        if (strlen($b_secondaryFocus[$i]->textContent)>1) {
        echo $b_secondaryFocus[$i]->textContent.", ";
        }
    }
}

if ($quotesText) {
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

function DOMinnerHTML(DOMNode $element)
{
    $innerHTML = "";
    $children  = $element->childNodes;

    foreach ($children as $child)
    {
        $innerHTML .= $element->ownerDocument->saveHTML($child);
    }

    return $innerHTML;
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