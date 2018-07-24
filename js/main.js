function onload() {
    // location
    if (geoplugin_city() && geoplugin_countryName()) {
    document.getElementById("location").value = geoplugin_city()+", "+geoplugin_countryName();
    } else if (geoplugin_countryName()) {
        document.getElementById("location").value = geoplugin_countryName();
    }
    // latitude longitude
    document.getElementById("latit").value = geoplugin_latitude();
    document.getElementById("longi").value = geoplugin_longitude();
}

function initialIsCapital( word ){
    return word[0] !== word[0].toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}



$(function() {
    google.maps.event.addDomListener(window, 'load', initialize);
    document.getElementById('textentry').focus();


    $("#textentry").keyup(function(e) {
        var code = e.keyCode || e.which;

        lastWordFinal = "";
        elementFinal = "";
        lastWord = "";
        element = "";
        availableTags = [];


        textEntryContent = document.getElementById("textentry").innerText;
        lastWord = getLastWord(textEntryContent);


            if (lastWord.length>=5) {
            console.log("Last Word: "+lastWord);
            $.ajax({
                url: 'api/dictionary.php?q=' + lastWord,
                type: 'GET',
                dataType: 'json',
                dataSrc: '0.Members',
                success: function (data) {
                    availableTags = data;
                     //console.log(availableTags);


                    // WIRE INTO DB for Suggestions
                    availableTags.forEach(function(element) {

                            var lastWordFinal = lastWord.toLowerCase();
                            var elementFinal = element.toLowerCase();
                            if (elementFinal.startsWith(lastWordFinal) === true) {
                                console.log("Found: "+elementFinal);

                                if (e.which != '9') {
                                    pasteHtmlAtCaret("<span id='hint'>" + element.substr(lastWord.length, element.length) + "</span>");
                                }
                                //pasteHtmlAtCaret(element.substr(lastWord.length, element.length));
                            }


                        if ((e.which == '32') || (e.which == '8') || (e.which == '13') || (e.which == '188') || (e.which == '186') || (e.which == '190'))  {
                            replaceSelectionWithHtml(" ");
                            lastWordFinal = "";
                            elementFinal = "";
                            lastWord = "";
                            element = "";
                            availableTags = [];
                            replaceSelectionWithHtml(" ");
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


    $("#textentry").keydown(function(e) {
        var code = e.keyCode || e.which;
        if (code == '9') {
            e.preventDefault();
            //document.getElementById("textentry").innerHTML = document.getElementById("textentry").innerHTML.replace("<br>","");
            //replaceSelectionWithHtml("");
            placeCaretAtEnd(document.getElementById("textentry"));
            //$('#textentry').trigger(jQuery.Event('keypress', { keycode: 39 }));
         //  pasteHtmlAtCaret ("");
            //placeCaretAtEnd(document.getElementById("textentry"));

          //  $("#textentry").trigger(jQuery.Event('keydown', { keycode: 39 }));
//            $("#textentry").trigger(jQuery.Event('keydown', { keycode: 39 }));

            return false;
        }

    });



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
        str = str.replace(/(\r\n\t|\n|\r\t)/gm," ");
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
            while ( (child = div.firstChild) ) {
                frag.appendChild(child);
            }
            range.insertNode(frag);
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.pasteHTML(html);
        }
    }
});


function initialize() {
    var goo = google.maps,
        mapOptions = {
            zoom: 14,
            center: new goo.LatLng(geoplugin_latitude(), geoplugin_longitude()),
            mapTypeId: goo.MapTypeId.ROADMAP,
            disableDefaultUI:true
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
                    margin:50,
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




