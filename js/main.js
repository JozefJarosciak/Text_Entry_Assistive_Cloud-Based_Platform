// Overrides the default autocomplete filter function to
// search only from the beginning of the string
$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");

    if (array) {
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
    }

};


function initialIsCapital( word ){
    return word[0] !== word[0].toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



$(function() {
    var availableTags;
    var word;
    var capitalizedResponse;
    var lastWord;

    // Getter
    var minLength = $(".selector").autocomplete("option", "minLength");

    // Setter
    $(".selector").autocomplete("option", "minLength", 3);

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
            $('#tags').autocomplete('close');
        } else if (word.length >= 3) {

            if (word.includes(".") === true) {
                word = word.replace(/\r?\n|\r/,"");
                word = word.substring(word.indexOf(".") + 1);
            }

            // $("label[for='helper']").text(word + " ==> " + word.length + " ==>" + word.indexOf("."));
            return word;

        }




    }

    $("#tags")
    // don't navigate away from the field on tab when selecting an item
        .on("keydown", function(event) {

            if (event.keyCode === 190) {
                console.log("pressed dot");
                $('#tags').autocomplete('close');

                //break;
            } else {

                if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }

            }






        })
        .autocomplete({
            delay: 50,
            minLength: 3,
            multiline: true,
            autoFocus: true,
            source: function(request, response) {
                // delegate back to autocomplete, but extract the last term

                lastWord = extractLast(request.term);


                if (lastWord) {
                    if (lastWord.length >= 3) {
                        // console.log("JOE: " + extractLast(request.term) );

                        $.ajax({
                            url: 'https://suggestqueries.google.com/complete/search?client=chrome&q='+lastWord,
                            type: 'GET',
                            dataType: 'jsonp',
                            dataSrc: '0.Members',
                            success: function (data) {
                                //  console.log(data);
                                availableTags = data[1];
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                //  console.log(jqXHR);
                                //  console.log(textStatus);
                                //  console.log(errorThrown);
                            }
                        });
                        response($.ui.autocomplete.filter(availableTags, lastWord));
                    }
                }





            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function(event, ui) {

                var str = document.getElementById("tags").value;
                //

                //  var pos = str.lastIndexOf(word);
//       str = str.substring(0,pos) + ui.item.value + str.substring(pos+1)



                str = str.substring(0, (str.length - word.length));
                //  $("label[for='helper2']").text(str);

                if (initialIsCapital(lastWord) === true) {
                    capitalizedResponse = capitalizeFirstLetter(ui.item.value);
                } else {
                    capitalizedResponse = ui.item.value;
                }

                document.getElementById("tags").value = str + capitalizedResponse + " " ;
                $('#tags').autocomplete('close');
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
