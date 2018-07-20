// Overrides the default autocomplete filter function to
// search only from the beginning of the string

/*
$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");

    if (array) {
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
    }

};
*/

function onload() {

   // document.getElementById('myTextArea').style.cursor = 'none';
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
    var availableTags;
    var word;
    var capitalizedResponse;
    var lastWord;

    // Getter
    var minLength = $(".selector").autocomplete("option", "minLength");

    // Setter
    $(".selector").autocomplete("option", "minLength", 2);

    function split(val) {
        // return val.split(/\s/mgi);
        return val.split(/ \s*/);

    }

    function extractLast(term) {
        /*

        var n = term.split(" ");
        var word = n[n.length - 1];

        */
        word = split(term).pop();

        if (word.length <= 2) {
            n = term.split(".");
            word = n[n.length - 1];
            word = "-----";
            $('#textentry').autocomplete('close');
        } else if (word.length >= 2) {

            if (word.includes(".") === true) {
                word = word.replace(/\r?\n|\r/,"");
                word = word.substring(word.indexOf(".") + 1);
            }

            // $("label[for='helper']").text(word + " ==> " + word.length + " ==>" + word.indexOf("."));

            var wordlist = word.split(/[^A-Za-z]/);
            word = wordlist[wordlist.length - 1];

            return word;

        }




    }


    function getLastWord(str){
        // strip punctuations
        str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g,' ');
        // get the last word
        return str.trim().split(' ').reverse()[0];
    }



    $("#textentry")
    // don't navigate away from the field on tab when selecting an item
        .on("keydown", function(event) {

            if (event.keyCode === 190) {
                //console.log("pressed dot");
                $('#textentry').autocomplete('close');

                //break;
            } else if (event.keyCode === 32) {
                //console.log("pressed dot");
                $('#textentry').autocomplete('close');

                //break;
            } else {

                if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }

            }






        })
        .autocomplete({
            delay: 50,
            minLength: 2,
            multiline: true,
            autoFocus: true,
            source: function(request, response) {
                // delegate back to autocomplete, but extract the last term

                position: {
                    offset: '20 4' // Shift 20px to the left, 4px down.
                }




                lastWord = extractLast(request.term);



            /*
                var sample = document.getElementById("textentry").value;
                var words= sample.split(" ");
                var lastButStr= words.pop();
                var lastStr = words.pop(); // removed the last.
                console.log(lastStr + " " + lastButStr  );
            */



                if (lastWord) {
                    if (lastWord.length >= 2) {
                        // console.log("JOE: " + extractLast(request.term) );
                        var urlsuggest = 'api/dictionary.php?q='+lastWord;

                        $.ajax({
                            url: urlsuggest,
                            type: 'GET',
                            dataType: 'json',
                            dataSrc: '0.Members',
                            success: function (data) {
                                //console.log(data );

                                  availableTags = data;
                                //console.log(availableTags);
                                    response($.ui.autocomplete.filter(availableTags, lastWord));

                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                 // console.log(jqXHR);
                                 // console.log(textStatus);
                                 // console.log(errorThrown);
                            }
                        });





                    }
                }





            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function(event, ui) {

                var str = document.getElementById("textentry").innerText;

                str = str.substring(0, (str.length - lastWord.length)-1);



                //  $("label[for='helper2']").text(str);

                if (initialIsCapital(lastWord) === true) {
                    capitalizedResponse = capitalizeFirstLetter(ui.item.value);
                } else {
                    capitalizedResponse = (ui.item.value);
                }

                if (str.endsWith(" ")===true) {
                document.getElementById("textentry").innerText = str + capitalizedResponse  ;
                } else {
                    document.getElementById("textentry").innerText = str + " " + capitalizedResponse ;
                }

                $('#textentry').autocomplete('close');
                placeCaretAtEnd(document.getElementById("textentry"));







                /*
                var terms = split(this.value);



                 // remove the current input
                 terms.pop();

                 // add the selected item
                 terms.push(ui.item.value);

                      $("label[for='helper2']").text(ui.item.value);

                 // add placeholder to get the comma-and-space at the end
                 terms.push("");
                 this.value = terms.join(" ");
                 */
                return false;
            }
        });
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


function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
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


google.maps.event.addDomListener(window, 'load', initialize);