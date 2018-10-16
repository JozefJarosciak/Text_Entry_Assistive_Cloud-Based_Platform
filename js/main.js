$(function() {

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
        var availableTags = [];
        var word;
        var capitalizedResponse;
        var lastWord;
        var hostname = window.location.href;
        var totalLength = 0;

        // FOCUS ON TEXT ENTRY FIELD
        document.getElementById('textarea').focus();

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
                $('#textarea').autocomplete('close');
            } else if (word.length >= 3) {

                if (word.includes(".") === true) {
                    word = word.replace(/\r?\n|\r/,"");
                    word = word.substring(word.indexOf(".") + 1);
                }

                // $("label[for='helper']").text(word + " ==> " + word.length + " ==>" + word.indexOf("."));
                return word;

            }




        }

        $("#textarea")
        // don't navigate away from the field on tab when selecting an item
            .on("keydown", function(event) {



                if (event.keyCode === 190) {
                    console.log("pressed dot");
                    $('#textarea').autocomplete('close');

                    //break;
                } else {

                    countCharacters();

                    if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                        event.preventDefault();
                     }

                }


            })
            .autocomplete({
                delay: 100,
                minLength: 3,
                multiline: true,
                autoFocus: true,
                source: function(request, response) {
                    // delegate back to autocomplete, but extract the last term

                    lastWord = extractLast(request.term);


                    if (lastWord) {
                        if (lastWord.length >= 3) {


                            availableTags = [];
                            console.log("LAST WORD: "+lastWord);

                            // last sentence
                            textEntryContent = document.getElementById("textarea").value;

                            var arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
                            var lastLine = arrayOfLines.slice(-1)[0];
                            if (lastLine.indexOf('.') > 0) {
                                lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
                                console.log("LAST SENTENCE: " + lastLine);
                            } else {
                                console.log("LAST SENTENCE: " + lastLine);
                            }

                            if (document.getElementById("myonoffswitch1").checked === true) {

                            if ((lastWord) && (lastWord.toString().length >= 2)) {
                                console.log("START SEARCH");
                                availableTags = [];

                                //$.getJSON("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + lastTypedWord + "&limit=10&namespace=0&format=json&callback=?", function (json) {


                                var stopWords = ['known','know','and','also','like','i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'need','needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];

                                var matches = stopWords.filter(function(windowValue){
                                    if(windowValue) {
                                        return (windowValue.substring(0, lastWord.toLowerCase().length) === lastWord.toLowerCase());
                                    }
                                });

                                if (matches.length<=0) {
                                    //console.log(hostname);
                            $.getJSON(hostname + "/api/search.php?q=" + lastWord + "&s=" + lastLine , function (json) {
                                    availableTags = json;
                                    console.log(availableTags);
                                    //response($.ui.autocomplete.filter(availableTags, lastWord));
                                    response(availableTags);
                                })
                                }


                            }
                            }


                        }
                    }





                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function(event, ui) {

                    var str = document.getElementById("textarea").value;
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

                    //document.getElementById("textarea").value = str + capitalizedResponse + " " ;
                    document.getElementById("textarea").value = str + capitalizedResponse  ;
                    $('#textarea').autocomplete('close');


                    countCharacters();

                        // with every keystroke calculate the totals
                        //console.log("Total Length: " + totalLength);

                    totalLength = Number(document.getElementById("totalLength").innerText);
                    var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                    var countSaved =  currentCountofKeystrokesSaved + Number(ui.item.value.length - lastWord.length);
                    console.log("Words: " + lastWord + " - " + ui.item.value + " | Saved: " + countSaved);
                    document.getElementById("keystrokesSaved").innerText = countSaved;


                    // percent saved
                    var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                    var percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100)  ;
                    document.getElementById("percentSaved").innerText = percentSaved.toString();




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
});


// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });



function onOffSwitch(){
    if (document.getElementById("myonoffswitch2").checked === true) {
        console.log("myonoffswitch2 - on");
        document.getElementById('quickHelpWrapper').style.display = 'block';
    } else {
        console.log("myonoffswitch2 - off");
        document.getElementById('quickHelpWrapper').style.display = 'none';
    }

    if (document.getElementById("myonoffswitch3").checked === true) {
        console.log("myonoffswitch3 - on");
        document.getElementById('analyticsWrapper').style.display = 'block';
    } else {
        console.log("myonoffswitch3 - off");
        document.getElementById('analyticsWrapper').style.display = 'none';
    }

}

function countCharacters() {
    totalLength = document.getElementById("textarea").value.length + 1;
    //console.log("Length: " + totalLength);
    document.getElementById("totalLength").innerText = totalLength;

    // percent saved
    var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
    var percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100)  ;
    document.getElementById("percentSaved").innerText = percentSaved.toString();

    if (totalLength < 4) {
        document.getElementById("keystrokesSaved").innerText = "0";
        document.getElementById("percentSaved").innerText = "0";
    }


}