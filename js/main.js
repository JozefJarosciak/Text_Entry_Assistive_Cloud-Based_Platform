let hostname = window.location.href.split('?')[0];
let network;
let nodes = new vis.DataSet([]);
let edges = new vis.DataSet([]);
let researchList = [];
let researchSentences = [];
let initialNetworkVis = 0;
let time2 = 0;
let running2 = 0;
let keyPresses = 0;
let displayHelp = 0;
let similarScoreRun = false;
let keyPressesRun = false;
let savedList = [];
let availTags = [];
let lastWiki = '';
$(function () {


    document.getElementById("transcribeTextWrapper").style.display = "none";
    document.getElementById("similarityCalculationWrapper").style.display = "none";
    document.getElementById("detailStat").style.display = "none";
    document.getElementById("form_container").style.display = "none";
    document.getElementById("wikiLookupWrapper").style.display = "none";
    document.getElementById("appendEnabled2").style.display = "block";
    document.getElementById("wordCloudWrapper").style.display = "block";



    getRandomWords();

    let availableTags = [];
    let word;
    let capitalizedResponse;
    let lastWord;
    let totalLength = 0;

    /*
        let url = new URL(window.location.href);
        let s1 = url.searchParams.get("s1");
        let s2 = url.searchParams.get("s2");
        if (s1 === "1") {s1 = "checked"} else {s1 = ""}
        if (s2 === "1") {s2 = "checked"} else {s2 = ""}
        console.log("PARAMETER 1: "+s1);
        console.log("PARAMETER 2: "+s2);
    */

// Overrides the default autocomplete filter function to
// search only from the beginning of the string
    $.ui.autocomplete.filter = function (array, term) {
        let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");

        if (array) {
            return $.grep(array, function (value) {
                return matcher.test(value.label || value.value || value);
            });
        }

    };


    // FOCUS ON TEXT ENTRY FIELD
    document.getElementById('textarea').focus();

    // Getter
    let minLength = $(".selector").autocomplete("option", "minLength");

    // Setter
    $(".selector").autocomplete("option", "minLength", 3);

    function split(val) {
        // return val.split(/\s/mgi);
        return val.split(/ \s*/);

    }

    function extractLast(term) {
        word = split(term).pop();
        if (word.length >= 3) {
            if (word.includes(".") === true) {
                word = word.replace(/\r?\n|\r/, "");
                word = word.substring(word.indexOf(".") + 1);
            }

            // $("label[for='helper']").text(word + " ==> " + word.length + " ==>" + word.indexOf("."));
            return word;

        }


    }


    $("#wikiLookup").keydown(function (event2) {
            if (event2.keyCode === 190) {
                $('#wikiLookup').autocomplete('close');
            } else {
                if (event2.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                    event2.preventDefault();
                }

               if (event2.keyCode === 13) {
                   var delayInMilliseconds = 500;
                   setTimeout(function() {
                       getDuckDuckGoArticle(document.getElementById("wikiLookup").value);
                   }, delayInMilliseconds);

                }



            }}).autocomplete({
        delay: 100,
        minLength: 1,
        multiline: false,
        autoFocus: true,
        appendTo: '#appendEnabled2',
        source: function(request2, response2) {
            if ((request2.term)) {
                if ((request2.term).length >= 2) {

                    $.getJSON("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + (request2.term) + "&limit=15&namespace=0&format=json&callback=?&redirects=resolve", function(json2) {

                        availTags = json2[1];
                    });

                    response2(availTags, request2.term);
                }
            }

        },
        focus: function() {
            return false;
        },
        select: function(event2, ui) {

            document.getElementById("wikiLookup").value = ui.item.value;
            $('#wikiLookup').autocomplete('close');
            getDuckDuckGoArticle(ui.item.value);

            return false;
        }
    });



    $("#textarea").keydown(function (e) {
        let code = e.keyCode || e.which;
        if (code == '9') {
            e.preventDefault();
            //placeCaretAtEnd(document.getElementById("textarea"));
            //pasteHtmlAtCaret ('  ');
            $('#textarea').autocomplete("close");
            return false;
        }

    });


    $("#textarea").keyup(function (event) {

        keyPresses = keyPresses + 1;
        if ((keyPresses >= 1) && (keyPressesRun == false)) {
            startPause2();
            keyPressesRun = true;
        }

        if (document.getElementById("creativeWritingSwitch").checked === true) {
            if (Number(document.getElementById("wordCounter").innerText) >= 100) {
                //document.getElementById("form_container").style.display = "block";
                startPause2();
              //  saveToDB(false, 0);
                openSaveDialog();
            }
        }

        if (document.getElementById("creativeWritingSwitch").checked === false) {
            let typedText = document.getElementById("textarea").value;
            let sentencesText = document.getElementById("transcribeText").innerText;
            let similscore = Math.round(((similarity(typedText.trim(), sentencesText.trim()) * 100)) * 100) / 100;
            //if (similscore<99.95) {
            document.getElementById("similarityCalculation").innerHTML = similscore + " %";
            //} else {                document.getElementById("similarityCalculation").innerHTML = "100 %" ;            }

            if ((keyPresses >= 1) && (keyPressesRun == false)) {
                startPause2();
                keyPressesRun = true;
            }


            let spaceCounter = (document.getElementById("textarea").value.split(" ").length - 1);

            if ((spaceCounter >= 50) && (Number(document.getElementById("wordCounter").innerText) >= 50)) {
                //if ((similscore>=99.99) && (similarScoreRun==false)) {

                similarScoreRun = true;

                /*
                document.getElementById("form_container").innerHTML = "<br><br><h1 id='resultHighlight'>Transcription Test Result:</h1>" +
                    " Total Key Presses: " + keyPresses.toString() +
                    " | Total Characters: " + document.getElementById("totalCharacters").innerText +
                    " | Total Words: " + document.getElementById("wordCounter").innerText +
                    " | Saved Keystrokes: " + document.getElementById("keystrokesSaved").innerText +
                    " | Time to Complete: " + document.getElementById("output2").innerText ;

                */
                document.getElementById("detailStat").style.display = "none";
                //document.getElementById("form_container").style.display = "block";

                startPause2();
              //  saveToDB(false, 0);
                openSaveDialog();
            }

        }
        //if (document.getElementById("transcriptionSwitch").checked === true) {
        if ((event.keyCode === 8) || (event.keyCode === 46)) {
            let currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
            let countSaved = currentCountofKeystrokesSaved - 1;
            if (countSaved<0) {countSaved=0;}
            document.getElementById("keystrokesSaved").innerText = countSaved;
        }


        if ((event.keyCode === 13) || (event.keyCode === 190) || (event.keyCode === 188)) {
            displayHelp = 1;
            // console.log(event.keyCode);
        } else {
            displayHelp = 0;
            //console.log(event.keyCode);
        }

        if ((event.keyCode === 190) || (event.keyCode === 32)) {
            //  console.log("space or dot pressed");
            $('#textarea').autocomplete("close");
            document.getElementById("shortHelp").innerHTML = "";
            if (document.getElementById("creativeWritingSwitch").checked === true) {
                getTopHelp();
            }
            // get top help ideas

            if (event.keyCode === 32) {
                lastWord = getLastWord(document.getElementById("textarea").value);
                if (lastWord) {
                    let optionsMark = {"separateWordSearch": true, "value": "exactly"};
                    $("#transcribeText").mark(lastWord, optionsMark);
                }
            }

        } else {


            if (event.keyCode === 13) {
                console.log("enter pressed");
                //event.preventDefault();
                $('#textarea').autocomplete("close");
            }
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }

        }

        // }

        updateStatistics();
    })
        .autocomplete({
            delay: 200,
            minLength: 3,
            multiline: true,
            autoFocus: true,
            appendTo: '#appendEnabled',
            source: function (request, response) {
                // delegate back to autocomplete, but extract the last term

                if (document.getElementById("transcriptionSwitch").checked === true) {


                    lastWord = getLastWord(request.term);


                    lastWordSpace = extractLast(request.term.trim());
                    let lastChar = request.term.substr(request.term.length - 1);
                    //console.log("!!!SPACE PRESSED!!! - '"+lastChar+"'");


                    if (lastChar == " ") {

                        // last sentence
                        textEntryContent = document.getElementById("textarea").value;

                        let arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
                        let lastLine = arrayOfLines.slice(-1)[0];

                        //console.log("log: " + lastLine);
                        let spaceCount = lastLine.split(" ").length - 1;

                        if (spaceCount > 1) {

                            if (lastLine.indexOf('.') > 0) {
                                lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
                            } else

                                console.log("START SEARCH");


                        } else {
                            $('#textarea').autocomplete("close");
                        }

                        updateStatistics();

                    } else if (lastWord) {
                        if (lastWord.length >= 3) {


                            console.log("LAST WORD: " + lastWord);

                            // last sentence
                            textEntryContent = document.getElementById("textarea").value;

                            let arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
                            let lastLine = arrayOfLines.slice(-1)[0];
                            if (lastLine.indexOf('.') > 0) {
                                lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
                                //  console.log("LAST SENTENCE: " + lastLine);
                            } else {
                                // console.log("LAST SENTENCE: " + lastLine);
                            }


                            if ((lastWord) && (lastWord.toString().length >= 2)) {
                                console.log("START SEARCH");
                                //  availableTags = [];

                                let stopWords = ['known', 'know', 'and', 'also', 'like', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'need', 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];

                                let matches = stopWords.filter(function (windowValue) {
                                    if (windowValue) {
                                        return (windowValue.substring(0, lastWord.toLowerCase().length) === lastWord.toLowerCase());
                                    }
                                });

                                if (matches.length <= 0) {
                                    //console.log(hostname);

                                    let url2 = hostname + "api/search.php?q=" + lastWord + "&s=" + lastLine + "&space=0";

                                    if (document.getElementById("creativeWritingSwitch").checked === false) {
                                        url2 = hostname + "api/search.php?q=" + lastWord + "&s=&space=0&t=1";
                                    }
                                    if (displayHelp === 0) {
                                        console.log(url2);
                                        $.getJSON(url2, function (json) {
                                            availableTags = [];
                                            availableTags = json;
                                            //    console.log(availableTags);


                                            response(availableTags);

                                        });

                                    } else {
                                        availableTags = [];
                                        lastWord = "";
                                    }
                                }


                            }


                        }
                        updateStatistics();
                    }

                }
            },
            focus: function () {
                if (document.getElementById("transcriptionSwitch").checked === true) {
                    // prevent value inserted on focus

                    return false;
                }
            },
            select: function (event, ui) {
                if (document.getElementById("transcriptionSwitch").checked === true) {


                    if (event.keyCode !== 190) {

                        let str = document.getElementById("textarea").value;

                        //console.log("STRING: " + str);

                        if (str.slice(-1) == " ") {
                            str = str.substring(0, (str.length - word.length) - 1);
                        } else {
                            str = str.substring(0, (str.length - word.length));
                        }

                        //console.log("SUBSTRING: " + str);

                        if (initialIsCapital(lastWord) === true) {
                            capitalizedResponse = capitalizeFirstLetter(ui.item.value);
                        } else {
                            capitalizedResponse = ui.item.value;
                        }

                        //document.getElementById("textarea").value = str + capitalizedResponse + " " ;
                        document.getElementById("textarea").value = str + capitalizedResponse;
                        //$('#textarea').autocomplete('close');


                        updateStatistics();


                        totalLength = Number(document.getElementById("totalLength").innerText);
                        var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                        if (!lastWord) {
                            lastWord = "";
                        }
                        let countSaved = currentCountofKeystrokesSaved + Number(ui.item.value.length - lastWord.length);
                        console.log("Words: " + lastWord + " - " + ui.item.value + " | Saved: " + countSaved);
                        savedList.push(lastWord + "|" + ui.item.value + "|" + Number(ui.item.value.length - lastWord.length));

                        if (countSaved<0) {countSaved=0;}
                        document.getElementById("keystrokesSaved").innerText = countSaved;


                        // percent saved

                        currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                        let currentCountoftotalCharacters = Number(document.getElementById("totalCharacters").innerText);
                        let percentSaved3 = (Math.round((currentCountofKeystrokesSaved / currentCountoftotalCharacters) * 100));

                        if (percentSaved3<0) {percentSaved3=0;}
                        document.getElementById("percentSaved").innerText = percentSaved3.toString();

                        /*
                        let currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                        let percentSaved2 = Math.floor(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100) / 100;
                        document.getElementById("percentSaved").innerText = percentSaved2.toString();
                        */
                        return false;
                    }

                }
            }
        });

});

function updateStatistics() {

    if (document.getElementById("textarea").value.length === 0) {
        document.getElementById("wordCounter").innerText = "0";
        document.getElementById("totalLength").innerText = "0";
        document.getElementById("totalCharacters").innerText = "0";
        document.getElementById("keystrokesSaved").innerText = "0";
        document.getElementById("percentSaved").innerText = "0";
    } else {
        let totalLength = document.getElementById("textarea").value.length;
        document.getElementById("totalLength").innerText = keyPresses.toString();
        document.getElementById("totalCharacters").innerText = totalLength.toString();


        // percent saved

        let currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
        let currentCountoftotalCharacters = Number(document.getElementById("totalCharacters").innerText);

        let percentSaved3 = (Math.round((currentCountofKeystrokesSaved / currentCountoftotalCharacters) * 100));
        if (percentSaved3<0) {percentSaved3=0;}
        document.getElementById("percentSaved").innerText = percentSaved3.toString();

        /*
        if (totalLength < 4) {
            document.getElementById("keystrokesSaved").innerText = "0";
            document.getElementById("percentSaved").innerText = "0";
        }
        */

        if ((document.getElementById("transcriptionSwitch").checked === false) && (document.getElementById("creativeWritingSwitch").checked === false)) {
            document.getElementById("keystrokesSaved").innerText = "0";
            document.getElementById("percentSaved").innerText = "0";
        }

        // Count Words
        let matches = (document.getElementById("textarea").value).match(/[\w\d\’\'-]+/gi);
        let countWordsSaved = matches ? matches.length : 0;
        document.getElementById("wordCounter").innerText = countWordsSaved.toString();
    }
}

function creativeWritingOnOff() {
    if (document.getElementById("creativeWritingSwitch").checked === true) {
        location.reload();
    } else {
        getRandomWords();
        savedList = [];
        researchList = [];
        keyPresses = 0;
        keyPressesRun = false;
        similarScoreRun = false;
        reset2();
        document.getElementById("output2").innerHTML = "00:00:00";
        document.getElementById("transcribeTextWrapper").style.display = "block";
        document.getElementById("similarityCalculationWrapper").style.display = "block";
        document.getElementById("wikiLookupWrapper").style.display = "block";
        document.getElementById("appendEnabled2").style.display = "none";
        document.getElementById("wordCloudWrapper").style.display = "none";

        document.getElementById("similarityCalculation").style.display = "none";
        document.getElementById("detailStat").style.display = "block";
        document.getElementById("textarea").value = "";
        document.getElementById("quickHelp").style.display = "none";
        //  document.getElementById("form_container").style.display = "none";
        document.getElementById("headerDiscovery").style.display = "none";
        document.getElementById("knowledgeBox").style.display = "none";
        document.getElementById("shortHelp").style.display = "none";
        document.getElementById("textareatd").style.width = "100%";
        document.getElementById("quickHelpCell").style.maxHeight = "120px";
        document.getElementById("quickHelpCell").style.minHeight = "120px";
        document.getElementById("textarea").style.maxHeight = "120px";
        document.getElementById("textarea").style.minHeight = "120px";
        document.getElementById("topTable").style.maxHeight = "120px";
        document.getElementById("textarea").value = "";
        document.getElementById("topHelp").innerHTML = "";
        document.getElementById("wordCounter").innerText = "0";
        document.getElementById("totalLength").innerText = "0";
        document.getElementById("totalCharacters").innerText = "0";
        document.getElementById("keystrokesSaved").innerText = "0";
        document.getElementById("percentSaved").innerText = "0";
        nodes = [];
        nodes = new vis.DataSet([]);
        edges = [];
        edges = new vis.DataSet([]);
        let container = document.getElementById('mynetwork');
        let data = {nodes: nodes, edges: edges};
        let options = {autoResize: true, height: '100%', width: '100%'};
        network = new vis.Network(container, data, options);
//        network.update();
        //  network.refresh();
        document.getElementById('textarea').focus();
    }
}

function transcriptionOnOff() {
    savedList = []; researchList = [];
    keyPresses = 0;
    keyPressesRun = false;
    similarScoreRun = false;
    reset2();
    document.getElementById("output2").innerHTML = "00:00:00";
    document.getElementById("textarea").value = "";
    document.getElementById("topHelp").innerHTML = "";
    document.getElementById("wordCounter").innerText = "0";
    document.getElementById("totalLength").innerText = "0";
    document.getElementById("totalCharacters").innerText = "0";
    document.getElementById("keystrokesSaved").innerText = "0";
    document.getElementById("percentSaved").innerText = "0";
    document.getElementById("detailStat").style.display = "block";
    //document.getElementById("form_container").style.display = "none";
    nodes = [];
    nodes = new vis.DataSet([]);
    edges = [];
    edges = new vis.DataSet([]);
    let container = document.getElementById('mynetwork');
    let data = {nodes: nodes, edges: edges};
    let options = {autoResize: true, height: '100%', width: '100%'};
    network = new vis.Network(container, data, options);
    //  network.update();
    // network.refresh();
    document.getElementById('textarea').focus();
    getRandomWords();
}

function initialIsCapital(word) {
    try {
        return word[0] !== word[0].toLowerCase();
    } catch (e) {
        $('#textarea').autocomplete("close");
    }
}

function capitalizeFirstLetter(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
        $('#textarea').autocomplete("close");
    }
}

function createWikiLinks(name) {
    researchList = uniq(researchList);
    let highlightName = "";
   // console.log("Saved List Terms:"); console.log(researchList);
    let result = "";
    for (let i = 0; i < researchList.length; i++) {
        //result = result + '<a href="javascript:void(0);" onclick="getDuckDuckGoArticle("'+researchList[i].trim()+'");\">'+ researchList[i].trim() + '</a> | ';
       // result = result + '<a href="javascript:void(0);" id="'+researchList[i].trim()+'" onclick="getDuckDuckGoArticle('+researchList[i].trim()+');">'+researchList[i].trim()+'</a> | ';

        let shortenedName = "";
        if (researchList[i].trim().length > 20){
            shortenedName = researchList[i].trim().substring(0,20)+'...';
        } else {
            shortenedName = researchList[i].trim();
        }

        result = result + '<button type="button" class="button button1" title="'+researchList[i].trim()+'" id="'+researchList[i].trim()+'" onclick="getDuckDuckGoArticle(\''+researchList[i].trim()+'\');">'+shortenedName+'</button> ';
     highlightName = researchList[i].trim();
        document.getElementById("wordCloud").innerHTML = result;
  //      document.getElementById("wordCloudWrapper").setAttribute("style", "border: 10px solid #4CAF50;");
    //    document.getElementById("wordCloudWrapper").setAttribute("style", "border: 1px solid #c2c2c2;");



    };




    //   $("#"+highlightName).attr('value', 'dsd');
}
function blink(){
    (function myLoop(i) {
        setTimeout(function () {
            document.getElementById("wordCloudWrapper").setAttribute("style", "border: " + i + "px solid #4CAF50;");
            if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
        }, 20)
    })(10);
}

function createNodesEdges(name, textForSearch) {
    //   if (name!=='I"s') {

    if (nodes.length > 0) {
        nodes.add({id: nodes.length + 1, label: name, shape: 'box'});
        edges.add({from: 1, to: nodes.length});

        if (arrayContains(name, researchList) === false) {
            researchList.push(name);
            createWikiLinks(name);
            blink();
        }



    } else {
        nodes.add({id: nodes.length + 1, label: name, shape: 'box'});
        if (arrayContains(name, researchList) === false) {
            researchList.push(name);
            createWikiLinks(name);
            blink();
        }
    }


    //showNodeInfo();'
 //   if (initialNetworkVis > 0) {
        network.focus(nodes.length + 1);  network.moveTo({position: {x: 0, y: 0}});
        //network.focus(nodes.length + 1, {scale: 1.0});  network.moveTo({position: {x: 0, y: 0}, scale: 1.0});
        addNodesAround(name, nodes.length, textForSearch);
   // }


    //
    //   }

}

function addNodesAround(name, id, textForSearch) {

    //   console.log(textForSearch);

    try {
        let splitText = textForSearch.split(".js");
        textForSearch = splitText[0];
    } catch (e) {
    }


    let colorNodes = getRandColor(5);
    /*
        let matches = (textForSearch).match(/[\w\d\’\'-]+/gi);
        let countWords = matches ? matches.length : 0;
        if (countWords === 1) {
            textForSearch =  "Word%20"+ textForSearch;
        }
    */
    //$.ajax({ url: hostname + "/api/google-knowledge-graph-api.php?d=1&q=" + name, success: function(data) {
    $.ajax({
        url: hostname + "/api/bing-text-analytics2.php?w=1&q=" + textForSearch, success: function (data) {

            let dataFinal = data.split("|");

            for (let forLoop1 = 0; forLoop1 < dataFinal.length; forLoop1++) {

                let nameForGraph = dataFinal[forLoop1];
                if (nameForGraph) {

                    let foundExist = 0;
                    for (let xx = 0; xx < nodes.length; xx++) {
                        let nameFinal = network.body.data.nodes._data[xx + 1].label.toLowerCase().trim();
                        if (nameForGraph.toLowerCase().trim() === nameFinal) {
                            foundExist++;
                        }
                    }
                    if (foundExist <= 0) {
                        nodes.add({id: nodes.length + 1, label: nameForGraph, shape: 'box', color: colorNodes});
                        let selectedArray = network.getSelectedNodes();


                        if (id) {
                            edges.add({from: id, to: nodes.length});
                        } else {
                            edges.add({from: selectedArray[0], to: nodes.length});
                        }

                    }

                }

            }
            if (id) {
                // network.nodes.update({id:id, x:0, y: 0});

                /*
                let $this = $('#textarea');
                let offset = $this.offset();
                let width = $this.width();
                let height = $this.height();

                let centerX = offset.left + width / 2;
                let centerY = offset.top + height / 2;
*/
                //network.nodes.focus({id:id, x:0, y: 0});

                for (let xx = 1; xx < nodes.length; xx++) {
                    nodes.update({
                        id: xx,
                        x: undefined, y: undefined,
                        fixed: {
                            x: false,
                            y: false
                        }
                    });
                }

                nodes.update({
                    id: id,
                    x: 0, y: 0,
                    fixed: {
                        x: true,
                        y: true
                    }
                });


                //network.moveTo({position: {x:0, y:0},scale: 1.0});

                //network.moveNode(id, 0, 0);

                /*
                                      nodes.update({
                                          id:id,
                                          x:0, y: 0,
                                          fixed: {
                                              x:false,
                                              y:false
                                          }
                                      });
                                      network.moveNode(id, 0, 0);
                                      */
            }
            //  document.getElementById("topHelp").innerHTML = dataFinal[1].trim();
        }
    });
    // if (initialNetworkVis>0) {
   // network.focus(id, {scale: 1.0});network.moveTo({position: {x: 0, y: 0}, scale: 1.0});
    network.focus(id);  network.moveTo({position: {x: 0, y: 0}});

}

function showKnowledgeGraph(id) {
    // create a network
    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges
    };

    // let options = {};

    let options = {
        //physics: {           barnesHut: {                avoidOverlap: 1            }},
        autoResize: true,
        height: '100%',
        width: '100%'
    };

    /*
    if (id) {
        nodes.update({
            id: id,
            x: undefined, y: undefined,
            fixed: {
                x: false,
                y: false
            }
        });
        network.moveNode(id, 0, 0);
    }
*/
    initialNetworkVis = initialNetworkVis + 1;
    if (initialNetworkVis === 1) {
        network = new vis.Network(container, data, options);
    }
    // let selectedArray = network.getSelectedNodes();


    /*
    network.on("selectNode", function (params) {
        let node = network.body.nodes[id];
        node.setOptions({
            selected: true
        });
    });
*/
    //   console.log("Selected Node: " + id);

    network.focus(id);
    network.moveTo({position: {x: 0, y: 0}});
}

function showNodeInfo() {
    //   document.getElementById("shortHelp").innerHTML = "";

    let selectedArray = network.getSelectedNodes();
    let nodeObj = network.body.data.nodes._data[selectedArray[0]];
    console.log(selectedArray[0] + " - " + nodeObj.label); //nodeObj.label to get label
    let selectedNodeID = selectedArray[0];

    if (arrayContains(nodeObj.label, researchList) === false) {
        researchList.push(nodeObj.label);
        blink();
    }

  //  createWikiLinks();
    getDuckDuckGoArticle(nodeObj.label);

}

function getRandColor(brightness) {
    // Six levels of brightness from 0 to 5, 0 being the darkest
    let rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    let mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
    let mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
        return Math.round(x / 2.0)
    });
    return "rgb(" + mixedrgb.join(",") + ")";
}

function enableHighlighting() {
    let s = window.getSelection();
    let range = s.getRangeAt(0);
    let node = s.anchorNode;
    while (range.toString().indexOf(' ') !== 0) {
        range.setStart(node, (range.startOffset - 1));
    }
    range.setStart(node, range.startOffset + 1);
    do {
        range.setEnd(node, range.endOffset + 1);

    } while (range.toString().indexOf(' ') === -1 && range.toString().trim() !== '');
    let str = range.toString().trim();

    let wordHighligted = " " + str;
    wordHighligted = wordHighligted.replace(/\s\s+/g, ' ');
    wordHighligted = wordHighligted.replace(/ \s*$/, "");
    console.log("SELECTED: " + wordHighligted);

    $("#textarea").val($("#textarea").val().trim() + wordHighligted);

    let textEntryContent = document.getElementById("textarea").value;
    let arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
    let lastLine = arrayOfLines.slice(-1)[0];
   // getDuckDuckGoArticle(lastLine);

    let searchWord1 = getLastWord(lastLine.replace(",","").replace(".","").replace(";",""));
    let searchWord2 = getLast2Words(lastLine.replace(",","").replace(".","").replace(";",""));
    let searchWord3 = getLast3Words(lastLine.replace(",","").replace(".","").replace(";",""));

    let keepSearching = false ;
    if (searchWord3) {

        let spaceCount = searchWord3.split(" ").length - 1;

        if (spaceCount > 1) {

            $.ajax({
                url: hostname + "/api/duckduckgo-api.php?q=" + searchWord3, success: function (data) {
                    //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                    let dataFinal = data.split("|");

                    if (dataFinal[3]) {

                        let isnum = /^\d+$/.test(searchWord3);
                        if (isnum === false) {
                            if (hasNumber(searchWord3) === false) {
                                getTopHelp(searchWord3);
                                keepSearching = true;
                            }
                            //createWikiLinks();
                        }
                    }
                }
            });
        }
    }

    if ((searchWord2) && (keepSearching !== true)) {
        $.ajax({
            url: hostname + "/api/duckduckgo-api.php?q=" + searchWord2, success: function (data) {
                //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                let dataFinal = data.split("|");

                if (dataFinal[3]) {

                    let isnum = /^\d+$/.test(searchWord2);
                    if (isnum===false) {
                        if (hasNumber(searchWord2) === false) {
                            getTopHelp(searchWord2);
                            keepSearching = true;
                        }
                        //createWikiLinks();
                    }
                }
            }
            });
    }

    if (keepSearching !== true) {
        if (searchWord1) {
        $.ajax({
            url: hostname + "/api/duckduckgo-api.php?q=" + searchWord1, success: function (data) {
                //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                let dataFinal = data.split("|");

                if (dataFinal[3]) {

                    let isnum = /^\d+$/.test(searchWord1);
                    if (isnum===false) {
                        if (hasNumber(searchWord1) === false) {
                            getTopHelp(searchWord1);
                        }
                        //createWikiLinks();
                    }
                }
            }
        });
    }
    }

    let currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
    let countSaved = currentCountofKeystrokesSaved + wordHighligted.length;
    if (countSaved<0) {countSaved=0;}
    document.getElementById("keystrokesSaved").innerText = countSaved;

    /*
    // percent saved
    let currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
    let percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100);
    document.getElementById("percentSaved").innerText = percentSaved.toString();
*/

    updateStatistics();

    document.getElementById('textarea').focus();

    if (document.getElementById("creativeWritingSwitch").checked === true) {
        if (Number(document.getElementById("wordCounter").innerText) >= 100) {
            //document.getElementById("form_container").style.display = "block";
            startPause2();
          //  saveToDB(false, 0);
            openSaveDialog();
        }
    }

}
function getDuckDuckGoArticle(nameForGraph) {
    let descriptionVariable = "";
    $.ajax({
        url: hostname + "/api/duckduckgo-api.php?q=" + nameForGraph, success: function (data) {
            //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

            let dataFinal = data.split("|");

            descriptionVariable = dataFinal[3];
            if (dataFinal[1]) {


                let nameForGraph = dataFinal[0];
                if (nameForGraph) {

                    let foundExist = 0;
                    for (let xx = 0; xx < nodes.length; xx++) {
                        let nameFinal = network.body.data.nodes._data[xx + 1].label.toLowerCase().trim();
                        if (nameForGraph.toLowerCase().trim() === nameFinal) {
                            foundExist++;
                            showKnowledgeGraph(xx + 1);
                            addNodesAround(nameForGraph, xx + 1, data);
                        }
                    }
                    if (foundExist <= 0) {
                        if (nameForGraph[0] === nameForGraph[0].toUpperCase()) {
                            createNodesEdges(nameForGraph, data);
                            showKnowledgeGraph();
                        }
                    }
                }

                if (arrayContains(dataFinal[0], researchList) === false) {
                    researchList.push(dataFinal[0]);
                    blink();
                }
              //  researchList.push(dataFinal[0]);
                researchList = uniq(researchList);

               // createWikiLinks();
                document.getElementById("topHelp").innerHTML = ' <b> ' + dataFinal[0] + ' </b> <table id="DuckDuckGo"><tr><td><img src="' + dataFinal[1] + '" width="100px"></td><td>' + " " + dataFinal[3] + '  &nbsp;<br><br>';


                try {
                    for (let xx = 4; xx < dataFinal.length; xx++) {
                        let dataFinal2 = dataFinal[xx].split(":");
                        if (dataFinal2[1].indexOf('local.js') < 0) {
                            if (dataFinal2[1].indexOf('""') < 0) {
                                if (dataFinal2[1].indexOf('undefined') < 0) {
                                    document.getElementById("topHelp").innerHTML += " <b> " + dataFinal2[0] + " </b>: " + dataFinal2[1] + " &nbsp;<br>";
                                }
                            }
                        }
                    }
                } catch (e) {
                }

                wordNotFound = 1;
            } else {
                /*
                if (nameForGraph) {
                    $.ajax({
                        // url: hostname + "/api/bing-parser.php?q=" + nodeObj.label, success: function (data2) {
                        url: hostname + "/api/google-knowledge-graph-api.php?q=" + nameForGraph, success: function (data2) {
                            //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                            if (data2) {

                                document.getElementById("topHelp").innerHTML = " <b> " + nameForGraph + " </b> <br> " + data2 + " <br>";
                                //     addNodesAround(nameForGraph, selectedArray[0], data2.removeStopWords());
                                //showKnowledgeGraph(selectedNodeID);
                            }

                        }
                    });
                }
                */
            }




        }
    });

    //Leading paragraph
    let urlForMoreInfo ="http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + nameForGraph.replace(" ","_") + "&callback=?";


    $.ajax({
        type: "GET",
        url: urlForMoreInfo,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
        if (data) {
            try {
                let markup = data.parse.text["*"];
                let blurb = $('<div></div>').html(markup);
                //   $('#article').html($(blurb).find('p'));

                let sentence = $(blurb).find('p').text();
                if (descriptionVariable) {
                    sentence = sentence.substring(sentence.indexOf(". ") + 1);
                }
                sentence = sentence.replace(/ *\([^)]*\) */g, " ").trim();
                sentence = sentence.replace(/(\[.*?\])/g, '').split(". ");
                sentence = sentence.reduce((prev, next, id) => prev + (id % 4 ? ". " : ". <br><br> ") + next);

                if (descriptionVariable) {
                    document.getElementById("topHelp").innerHTML += " <br> <table id=\"DuckDuckGo\"><tr><td> " + sentence + " <br> ";
                } else {
                    if (sentence.indexOf("Redirect to:")>=0) {
                        // document.getElementById("topHelp").innerHTML = " Cannot locate your article!<br><br>If your term contains accented characters, please use them in your search.<br> ";
                    } else {
                        if (sentence.indexOf("Undefined may")<0) {
                      //  document.getElementById("topHelp").innerHTML = "  " + sentence + " <br> ";
                        }
                    }
                }
            } catch (e) {

            }


        }
        },
        error: function (errorMessage) {
        }
    });


        document.getElementById("topHelp").innerHTML += '</td></tr></table>';
    setTimeout(function(){
        $('#quickHelp').scrollTop(0);
    }, 10);

    // createWikiLinks();
//    console.log("Saved List Terms:"); console.log(researchList);
}

function getTopHelp(orWord) {
    //  document.getElementById("shortHelp").innerHTML = "";

    let textEntryContent = document.getElementById("textarea").value;
    let arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
    let lastLine = arrayOfLines.slice(-1)[0];

    if (lastLine.indexOf('.') > 0) {
        lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
        //  console.log("LAST SENTENCE: " + lastLine);
    } else {
        // console.log("LAST SENTENCE: " + lastLine);
    }

    //let spaceCount = (lastLine.removeStopWords().split(" ").length - 1);
    let spaceCount = (lastLine.split(" ").length - 1);
    console.log("spaceCount: " + spaceCount);

    let wordNotFound = 0;

    let last3words =getLast3Words(lastLine);
    //last3words = last3words.replace('undefined','');

    if (orWord) {last3words = orWord;}

  //  let gotoURL = hostname + "api/wikipedia-api.php?q=" + last3words.trim().removeStopWords();
    $.ajax({
       // url: hostname + "api/wikipedia-api.php?q=" + last3words.trim().removeStopWords(), success: function (data) {
          //url: hostname + "/api/google-knowledge-graph.php?q=" + textEntryContent, success: function (data) {
            url: hostname + "/api/bing-text-analytics2.php?w=0&q=" + textEntryContent, success: function (data) {
            //$.ajax({ url: hostname + "/api/binfreg-text-analytics.php?q=" + lastLine, success: function(data) {

           let dataFinal = data.split("|");
           let lastRecognizedElement = dataFinal[dataFinal.length - 2];
            //let lastRecognizedElement = data;
            let nameForGraph = lastRecognizedElement;

            //let nameForGraph = lastRecognizedElement;

            if (nameForGraph.indexOf("Undefined index")<0) {
                let isnum = /^\d+$/.test(nameForGraph);
                if (isnum===false) {
                if (researchList[researchList.length-1] !== nameForGraph) {
                    //getDuckDuckGoArticle(nameForGraph);

                    // this should only happen when duckduckgo has picture

                    $.ajax({
                        url: hostname + "/api/duckduckgo-api.php?q=" + nameForGraph, success: function (data) {
                            //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                            let dataFinal = data.split("|");

                            if (dataFinal[1]) {
                                let isnum = /^\d+$/.test(nameForGraph);
                                if (isnum===false) {
                                    if (hasNumber(nameForGraph) === false) {

                                        if (arrayContains(nameForGraph, researchList) === false) {
                                            researchList.push(nameForGraph);
                                            createWikiLinks(nameForGraph);
                                            blink();
                                        }
                                  //  researchList.push(nameForGraph);


                                    }
                                }
                            }
                        }
                    });
                }
                }
            } else {

                /*
                let getString = getLast3Words(lastLine.removeStopWords().replace(/[0-9]/g, '')).replace("undefined","").trim();
                $.ajax({
                    url: hostname + "/api/wikipedia-api.php?q=" + getString, success: function (data2) {
                        let wikiGet = data2.trim();
                if (wikiGet) {
                        getDuckDuckGoArticle(wikiGet);
                }
                    }
                });
*/
            }

            //  document.getElementById("topHelp").innerHTML = dataFinal[1].trim();
        }
    });

    if (spaceCount >= 1) {
        researchList = uniq(researchList);

        if (spaceCount>4) {

            if (researchList[researchList.length-1] === getLast3Words(lastLine).removeStopWords()) {
                if(typeof researchList[researchList.length-2] !== 'undefined') {
                lastLine =  researchList[researchList.length-2] + " " + getLast3Words(lastLine).removeStopWords();
                }
            }else {
                lastLine =  researchList[researchList.length-1] + " " + getLast3Words(lastLine).removeStopWords();
            }

            console.log("Adjusted Last Line:" + lastLine)
        }

        lastLine=lastLine.split(' ').filter(function(allItems,i,a){
            return i==a.indexOf(allItems);
        }).join(' ');

        if (lastLine.removeStopWords()) {
        let url2 = hostname + "api/bing-parser.php?q=" + lastLine.removeStopWords();
        console.log(url2);
        $.get(url2, function (json) {
            json = json + '. ';
            let sentenceArray = json.split(". ");
            let firstSentence = sentenceArray[0];
            //if ((json.length > 2) && (json.length < 25)) {
            if (json.length > 2) {

                firstSentence = firstSentence.split(' ').slice(0, 10).join(' ');

                if (firstSentence.slice(-3) === "...") {
                    firstSentence = firstSentence.substring(0, firstSentence.length - 3);
                }

                if (firstSentence.slice(-2) === ", ") {
                    firstSentence = firstSentence.substring(0, firstSentence.length - 2);
                }

                if (firstSentence.slice(-1) === ",") {
                    firstSentence = firstSentence.substring(0, firstSentence.length - 1);
                }

                if (firstSentence.indexOf("Image:") < 0) {
                    //  console.log(researchSentences);
                    //if (arrayContains(firstSentence,researchSentences) === false) {
                    document.getElementById("shortHelp").innerHTML = " Suggestion: <b> " + firstSentence + " </b> <br> ";
                    researchSentences.push(firstSentence);
                    //}


                } else {
                    let firstSentence2 = splitMulti(firstSentence, ['.com', '.net', '.org', '.com', '.edu', '.gov', '.uk', '.au']);

                    firstSentence = firstSentence2[1];
                    // console.log(researchSentences);
                    //if (arrayContains(firstSentence,researchSentences) === false) {
                    document.getElementById("shortHelp").innerHTML = " Suggestion: <b> " + firstSentence + " </b> <br> ";
                    researchSentences.push(firstSentence);
                    //}

                }


                // try if help comes up with something from wikipedia
                let wikiLink = firstSentence;

                if (hasNumber(wikiLink) === false) {
                    //  let wikiLink2 = firstSentence.replace(/[0-9]/g, '');
                    // wikiLink2 = wikiLink2.split(/jan/i).join('').split(/feb/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('');


                    $.ajax({
                        url: hostname + "/api/wikipedia-api.php?q=" + wikiLink, success: function (data) {
                            console.log("Wikipedia:" + data);



                            //  console.log(researchSentences);//
                            wikiLink = data;
                            if (arrayContains(data, researchSentences) === false) {
                                if (data.toLowerCase().indexOf("undefined") < 0) {
                                    document.getElementById("shortHelp").innerHTML = " Suggestion: <b> " + data + " </b> <br> ";
                                    //document.getElementById("shortHelp").innerHTML = " Suggestion: " + data + " <br> ";
                                    researchSentences.push(data);
                                }
                            }
                        }
                    });


                    console.log("Wiki: " + wikiLink);
                }
            }
        });

        }

    }


}

function getRandomWords() {
    document.getElementById("textarea").value = "LOADING...";
    let url2 = hostname + "api/randomwords.php";
    $.get(url2, function (randomwords) {
        document.getElementById("transcribeText").innerText = randomwords;
    });
    document.getElementById("textarea").value = "";
    // document.getElementById("similarityCalculation").innerText = "0%";


    keyPresses = 0;
    keyPressesRun = false;
    similarScoreRun = false;
    reset2();
    document.getElementById("output2").innerHTML = "00:00:00";
    document.getElementById("textarea").value = "";
    document.getElementById("topHelp").innerHTML = "";
    document.getElementById("wordCounter").innerText = "0";
    document.getElementById("totalLength").innerText = "0";
    document.getElementById("totalCharacters").innerText = "0";
    document.getElementById("keystrokesSaved").innerText = "0";
    document.getElementById("percentSaved").innerText = "0";
    document.getElementById("detailStat").style.display = "block";
//    document.getElementById("form_container").style.display = "none";
    nodes = [];
    nodes = new vis.DataSet([]);
    edges = [];
    edges = new vis.DataSet([]);
    let container = document.getElementById('mynetwork');
    let data = {nodes: nodes, edges: edges};
    let options = {autoResize: true, height: '100%', width: '100%'};
    network = new vis.Network(container, data, options);
    //  network.update();
    // network.refresh();
    document.getElementById('textarea').focus();

}

function getLastWord(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    return str.trim().split(" ").reverse()[0];
}

function getLast3Words(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word

    if (str.trim().split(" ").reverse()[2]) {
        return str.trim().split(" ").reverse()[2] + " " + str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
    }

    if (str.trim().split(" ").reverse()[1]) {
        return str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
    }

    if (str.trim().split(" ").reverse()[0]) {
        return str.trim().split(" ").reverse()[0];
    }




}

function getLast2Words(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    if (str.trim().split(" ").reverse()[1]) {
        return str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
    }
}

function splitMulti(str, tokens) {
    let tempChar = tokens[0]; // We can use the first token as a temporary join character
    for (let i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

function hasNumber(myString) {
    return /\d/.test(myString);
}

function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function startPause2() {
    if (running2 == 0) {
        running2 = 1;
        increment2();
        // document.getElementById("startPause2").innerHTML = "Pause";
    } else {
        running2 = 0;
        //document.getElementById("startPause2").innerHTML = "Resume";
    }
}

function reset2() {
    running2 = 0;
    time2 = 0;
//    document.getElementById("startPause2").innerHTML = "Start";
    document.getElementById("output2").innerHTML = "00:00:00";
}

function increment2() {
    if (running2 == 1) {
        setTimeout(function () {
            time2++;
            let mins2 = Math.floor(time2 / 10 / 60);
            let secs2 = Math.floor(time2 / 10 % 60);
            let tenths2 = time2 % 10;

            if (mins2 < 10) {
                mins2 = "0" + mins2;
            }

            if (secs2 < 10) {
                secs2 = "0" + secs2;
            }

            document.getElementById("output2").innerHTML = mins2 + ":" + secs2 + ":" + "0" + tenths2;

            /// ===============================
            /// This is your fix
            /// ===============================
            // increment();
            increment2();
            /// ===============================

        }, 100);
    }
}

function saveToDB(response, message) {

    let testtype = 0;

    if (document.getElementById("transcriptionSwitch").checked === true) {
        testtype = 2;
    } else {
        testtype = 1;
    }

    if ((document.getElementById("creativeWritingSwitch").checked === true) && (document.getElementById("transcriptionSwitch").checked === true)) {
        testtype = 3;
    } else if ((document.getElementById("creativeWritingSwitch").checked === true) && (document.getElementById("transcriptionSwitch").checked === false)) {
        testtype = 4;
    }

    let postResultUrl = hostname + "api/sendresult.php?";

    let gender = "Other";

    if (document.getElementById("gender1").checked === true) {
        gender = "Male";
    } else if (document.getElementById("gender2").checked === true) {
        gender = "Female";
    }

    let lastWrd = getLast5Words(document.getElementById("transcribeText").innerText);
    let sentencesText = document.getElementById("transcribeText").innerText.replace(lastWrd, "").trim();
    let typedText = document.getElementById("textarea").value.trim();
    typedText = typedText.replace(/[\n\r]/g, ' ');


    let similarityScore = Math.round(((similarity(typedText.trim(), sentencesText.trim()) * 100)) * 100) / 100;

    researchList = uniq(researchList);


    $.post(
        postResultUrl,
        {
            n: document.getElementById("your_name").value,
            e: document.getElementById("email").value,
            a: document.getElementById("age").value,
            g: gender,
            tk: keyPresses.toString(),
            tc: document.getElementById("totalCharacters").innerText,
            tw: document.getElementById("wordCounter").innerText,
            sk: document.getElementById("keystrokesSaved").innerText,
            ttc: document.getElementById("output2").innerText,
            tt: testtype.toString(),
            s: similarityScore,
            t: typedText,
            wt: sentencesText,
            wc: savedList.length,
            wp: savedList.join(";"),
            wlc: researchList.length,
            wl: researchList.join(";")
        },
        function (datar) {
            if (response === true) {
                alert("Thank you, we've received your test result!");
                location.reload();
            } else {
                if (message === 1) {
                    alert("Thank you, this test has completed. We've saved your test results!");
                }
            }
        }
    );
    // alert("Thanks you, we've received your test result!");
}

function openSaveDialog() {
    $("#form_container").dialog({
        resizable: false,
        height: "auto",
        width: 500,
        modal: true,
        buttons: {
            "Submit Results": function () {
                saveToDB(true, 0);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function uniq(a) {
    let seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

String.prototype.removeStopWords = function () {
    let x;
    let y;
    let word;
    let stop_word;
    let regex_str;
    let regex;
    let cleansed_string = this.valueOf();
    let stop_words = ['a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'];

    // Split out all the individual words in the phrase
    let words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g);
    try {
        // Review all the words
        for (x = 0; x < words.length; x++) {
            // For each word, check all the stop words
            for (y = 0; y < stop_words.length; y++) {
                // Get the current word
                word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha

                // Get the stop word
                stop_word = stop_words[y];

                // If the word matches the stop word, remove it from the keywords
                if (word.toLowerCase() == stop_word) {
                    // Build the regex
                    regex_str = "^\\s*" + stop_word + "\\s*$";      // Only word
                    regex_str += "|^\\s*" + stop_word + "\\s+";     // First word
                    regex_str += "|\\s+" + stop_word + "\\s*$";     // Last word
                    regex_str += "|\\s+" + stop_word + "\\s+";      // Word somewhere in the middle
                    regex = new RegExp(regex_str, "ig");

                    // Remove the word from the keywords
                    cleansed_string = cleansed_string.replace(regex, " ");
                }
            }
        }
    } catch (e) {

    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
};

// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function () {
        let savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function () {
        let minRows = this.getAttribute('data-min-rows') | 0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows + 1;
    });



function getLast5Words(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    return str.trim().split(" ").reverse()[4] + " " + str.trim().split(" ").reverse()[3] + " " + str.trim().split(" ").reverse()[2] + " " + str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
}

function getInnerText(el) {
    let sel, range, innerText = "";
    if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        innerText = range.text;
    } else if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        sel = window.getSelection();
        sel.selectAllChildren(el);
        innerText = "" + sel;
        sel.removeAllRanges();
    }
    return innerText;
}