function onload() {
    // location
    if (geoplugin_city() && geoplugin_countryName()) {
        document.getElementById("location").value = geoplugin_city() + ", " + geoplugin_countryName();
    } else if (geoplugin_countryName()) {
        document.getElementById("location").value = geoplugin_countryName();
    }
    // latitude longitude
    document.getElementById("latit").value = geoplugin_latitude();
    document.getElementById("longi").value = geoplugin_longitude();

}

function initialIsCapital(word) {
    return word[0] !== word[0].toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}


$(function () {

    document.getElementById('textentry').focus();
    google.maps.event.addDomListener(window, 'load', initialize);
    var lastWord = "";
    var elementFinal = "";
    var lastWordFinal = "";
    $("#textentry").keyup(function (e) {
        var code = e.keyCode || e.which;



       // document.getElementById("justText").innerText = document.getElementById('textentry').innerText;

        textEntryContent = document.getElementById("textentry").innerText;
        //console.log("Last 1: " + textEntryContent);
        textEntryContent = textEntryContent.replace(/.*\./,"").replace(/.*\,/,"").replace(/.*\;/,"");
       // console.log("Last 2: " + textEntryContent);

        /*
        if (e.which == '32') {
            textEntryContent = textEntryContent.match(/\S*$/)[0];
            console.log("Last 3: " + textEntryContent);
        }
        */

        lastWord = getLastWord(textEntryContent);
      //  console.log("Last 4: " + lastWord);
        //lastWord = getLastWord(textEntryContent).match(/\S*$/)[0];
      //  lastWord = lastWord.replace(/.*\./,"").trim();
        console.log("Last Word: " + lastWord);
        foundSpellCheck = "";
        if (lastWord.length >= 5) {



            $.ajax({
                url: 'api/dictionary.php?q=' + lastWord,
                type: 'GET',
                dataType: 'json',
                dataSrc: '0.Members',
                success: function (data) {
                    availableTags = data;
                    //console.log(availableTags);


                    // WIRE INTO DB for Suggestions
                    availableTags.forEach(function (element) {

                        lastWordFinal = lastWord.toLowerCase();
                        elementFinal = element.toLowerCase();

                        // If correct word found in the DB
                        if (elementFinal.startsWith(lastWordFinal) === true) {
                            if (e.which != '32') {
                                console.log("Found: " + elementFinal);

                                if ((e.which != '9') && (e.which != '20')) {
                                    pasteHtmlAtCaret("<span id='hint'>" + element.substr(lastWord.length, element.length) + "</span>");
                                    //pasteHtmlAtCaret(element.substr(lastWord.length, element.length));
                                }
                            }
                        } else {

                            // If misspelling found in the DB
                            if (elementFinal.length >0) {

                                if (e.which == '32') {
                                   // console.log("elementFinal: " + lastWordFinal);
                                    //lastWordFinal = lastWordFinal.match(/\S*$/)[0];
                                    //console.log("Last 5: " + lastWordFinal);

                                   // if ((e.which != '9') && (e.which != '20')) {
                                    foundSpellCheck = elementFinal;


                                    console.log("MYSQL Typo Replacement Found: " + foundSpellCheck);

                                    if (initialIsCapital(lastWord) === true) {
                                        foundSpellCheck = capitalizeFirstLetter(foundSpellCheck);
                                    }
                                    replaceSelectionWithHtml(" "); replaceSelectionWithHtml(" ");
                                    pasteHtmlAtCaret("<span id=\"hint\">?" + foundSpellCheck + "</span>");

                                        //document.getElementById("textentry").innerHTML = document.getElementById("textentry").innerText.replace(lastWord,elementFinal).replace(/(?:\r\n|\r|\n)/g, '<br>');
                                        //placeCaretAtEnd(document.getElementById("textentry"));
                                   // }

                                }

                            } else {


                            // Try Spelling if the word is not found in DB
                            //if ((e.which == '32') && (availableTags.length === 0)) {
                             if (e.which == '32') {
                              //   elementFinal=""; resetVars(); lastWordFinal = ""; lastWord = "";
                                //
                                // use Microsoft Spellcheck
                                // console.log(lastWord)
                                $.getJSON('api/bing-spellcheck.php?q=' + lastWord, function (result) {
                                    //$.each(result, function(i, field){
                                    //$("div").append(field + " ");
                                    //pasteHtmlAtCaret("<span id='hint'>" + element.substr(lastWord.length, element.length) + "</span>");
                                    //});

                                    //var parsed = JSON.parse(result);
                                    //console.log("SECOND: " + result["flaggedTokens"][0]["suggestions"][0]["suggestion"]);




                                    try{
                                        var element2 = "";
                                        console.log(result);
                                        if (result["flaggedTokens"][0]["suggestions"][0]["suggestion"]) {

                                            document.getElementById("spelling").innerHTML = "";
                                          //  lastWord = lastWord.toLowerCase();

                                            var numofSpellSuggestions = result["flaggedTokens"][0]["suggestions"].length;

                                            for (i = 0; i < numofSpellSuggestions; i++) {

                                                element2 = result["flaggedTokens"][0]["suggestions"][i]["suggestion"];
                                                if (lastWord.toLowerCase().indexOf(element2) < 0) {
                                                    if (i==0) {
                                                        document.getElementById("spelling").innerHTML = document.getElementById("spelling").innerHTML + lastWord + " &#x2192; <b>" + element2 + "</b>"

                                                        if (initialIsCapital(lastWord)===true) {
                                                            element2 = capitalizeFirstLetter(element2);
                                                        }

                                                        document.getElementById("textentry").innerHTML = document.getElementById("textentry").innerText.replace(lastWord,element2).replace(/(?:\r\n|\r|\n)/g, '<br>');
                                                        //document.getElementById("textentry").innerHTML = element2;
                                                        placeCaretAtEnd(document.getElementById("textentry"));
                                                        console.log(lastWord + " -> " + element2);
                                                        //replacer(lastWord,element2);

                                                    } else {
                                                       // document.getElementById("spelling").innerHTML = document.getElementById("spelling").innerHTML + "<br>" + lastWord + " &#x2192; <b>" + element2 + "</b>"
                                                    }

                                                }
                                            }

                                            //console.log("RESULT: " + element);
                                        }

                                    }catch(e){
                                        //console.log("YO",e)
                                    }




                                    //pasteHtmlAtCaret("<span id='hint'>" + element.substr(lastWord.length, element.length) + element + "</span>");
                                    //flaggedTokens["0"].suggestions["0"].suggestion


                                });
                                 lastWord = "";
                        }
                            }

                        }

                        if ((code == '8') || (code == '13') || (code == '188') || (code == '186') || (code == '190')) {
                            replaceSelectionWithHtml(" ");
                            replaceSelectionWithHtml(" ");
                            resetVars(); lastWord="";
                            elementFinal = "";

                            if (code == '190') {
                            console.log("Pressed:.");
                                elementFinal=""; resetVars(); lastWordFinal = ""; lastWord = "";
                            }
                        }
                    });


                    /*
                    if (availableTags[0].indexOf(lastWord) >= 0) {
                        console.log("ONE: " + lastWord);
                        response($.ui.autocomplete.filter(availableTags, lastWord));
                    } else {
                        console.log("TWO: " + lastWord);
                        response($.ui.autocomplete.filter(availableTags, ''));
                    }
                    //availableTags = [];
                    */
                }
            });




        }


    });


    $("#textentry").keydown(function (e) {
        var code = e.keyCode || e.which;
        // If TAB is pressed
        if (code == '9') {
            // if typo correction found in MySQL
            console.log(lastWord + " -> " + foundSpellCheck);
            if (foundSpellCheck) {
                replaceSelectionWithHtml("");
                document.getElementById("textentry").innerHTML = document.getElementById("textentry").innerText.replace(lastWord,foundSpellCheck).replace(/(?:\r\n|\r|\n)/g, '<br>');
                placeCaretAtEnd(document.getElementById("textentry"));
                foundSpellCheck = "";
            } else {
            // if there is just suggestion, no type, accept the suggestion
            e.preventDefault();
            placeCaretAtEnd(document.getElementById("textentry"));
            resetVars();
            lastWord = "";
            foundSpellCheck = "";
             }

            return false;
        }



    });



    function resetVars() {
        lastWordFinal = "";
        elementFinal = "";
        element = "";
        availableTags = [];
    }


    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(),
                    node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    }


    function getLastWord(str) {
        // strip punctuations
        str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
        str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
        // get the last word
        return str.trim().split(" ").reverse()[0];
    }


    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" &&
            typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }


    function replaceSelectionWithHtml(html) {
        var range;
        if (window.getSelection && window.getSelection().getRangeAt) {
            range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            var div = document.createElement("div");
            div.innerHTML = html;
            var frag = document.createDocumentFragment(), child;
            while ((child = div.firstChild)) {
                frag.appendChild(child);
            }
            range.insertNode(frag);
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.pasteHTML(html);
        }
    }
});

function selectedText() {
    var selection = window.getSelection().anchorNode.data.substring( window.getSelection().anchorOffset,window.getSelection().extentOffset );
    return selection;
}

function initialize() {
    var goo = google.maps,
        mapOptions = {
            zoom: 14,
            center: new goo.LatLng(geoplugin_latitude(), geoplugin_longitude()),
            mapTypeId: goo.MapTypeId.ROADMAP,
            disableDefaultUI: true
        },
        map = new goo.Map(document.getElementById('map_canvas'),
            mapOptions),
        marker = new goo.Marker({
            map: map,
            position: map.getCenter()
        });


    $('#fancybutton')
        .prop({
            disabled: false
        })
        .click(function () {

            $.fancybox(map.getDiv(),

                {
                    width: 600,
                    height: 400,
                    margin: 50,
                    autoSize: false,
                    afterShow: function (a, z) {
                        map.setOptions({
                            disableDefaultUI: false
                        })
                        goo.event.trigger(map, 'resize');
                        map.setCenter(this.content.data('center'));
                    },

                    beforeLoad: function (a) {
                        this.content.data({
                            parent: this.content.parent(),
                            center: map.getCenter()
                        })
                    },

                    beforeClose: function () {
                        this.content.data({
                            center: map.getCenter()
                        })

                    },
                    afterClose: function () {
                        map.setOptions({
                            disableDefaultUI: true
                        })
                        this.content.appendTo(this.content.data('parent')).show();
                        goo.event.trigger(map, 'resize');
                        map.setCenter(this.content.data('center'));
                    }
                });

        });


}




