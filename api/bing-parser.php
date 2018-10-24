<?php
//error_reporting(0);
$url = "https://www.bing.com/search?q=arnold+schwarzenegger+age";

$html = get_data($url,0);

//echo $doc;

$dom = new \DOMDocument('1.0');
@$dom->loadHTML($html);
$elementsByClass = getElementsByClassName($dom, 'b_focusTextMedium', 'div');

/*
print "<pre>";
print_r( $elementsByClass);
print "</pre>";
*/

//echo $elementsByClass->getAttribute('textContent');
echo $elementsByClass[0]->textContent;

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