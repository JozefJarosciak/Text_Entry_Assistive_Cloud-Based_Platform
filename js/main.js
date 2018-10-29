var hostname = window.location.href;
var network;
var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var researchList = [];
var researchSentences = ["undefined"];
var initialNetworkVis = 0;

$(function () {
    var availableTags = [];
    var word;
    var capitalizedResponse;
    var lastWord;
    var totalLength = 0;


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

    //$("#textarea").on("keydown", function (event) {

    $("#textarea").keypress(function (event) {

            if ((event.keyCode === 8) || (event.keyCode === 46)) {
                var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                var countSaved = currentCountofKeystrokesSaved - 1;
                document.getElementById("keystrokesSaved").innerText = countSaved;
            }


            if ((event.keyCode === 190) || (event.keyCode === 32)) {
                //  console.log("space or dot pressed");
                $('#textarea').autocomplete("close");
                if (document.getElementById("myonoffswitch1").checked === true) {
                    getTopHelp();
                }
                // get top help ideas


            } else {

                if (event.keyCode === 13) {
                    console.log("enter pressed");
                }

                if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }

            }

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

                lastWord = extractLast(request.term);
                lastWordSpace = extractLast(request.term.trim());
                var lastChar = request.term.substr(request.term.length - 1);
                //console.log("!!!SPACE PRESSED!!! - '"+lastChar+"'");

                if (document.getElementById("myonoffswitch1").checked === true) {

                    if (lastChar == " ") {

                        // last sentence
                        textEntryContent = document.getElementById("textarea").value;

                        var arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
                        var lastLine = arrayOfLines.slice(-1)[0];

                        //console.log("log: " + lastLine);
                        var spaceCount = lastLine.split(" ").length - 1;

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

                            var arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
                            var lastLine = arrayOfLines.slice(-1)[0];
                            if (lastLine.indexOf('.') > 0) {
                                lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
                                //  console.log("LAST SENTENCE: " + lastLine);
                            } else {
                                // console.log("LAST SENTENCE: " + lastLine);
                            }

                            if (document.getElementById("myonoffswitch1").checked === true) {

                                if ((lastWord) && (lastWord.toString().length >= 2)) {
                                    console.log("START SEARCH");
                                    //  availableTags = [];

                                    var stopWords = ['known', 'know', 'and', 'also', 'like', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'need', 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];

                                    var matches = stopWords.filter(function (windowValue) {
                                        if (windowValue) {
                                            return (windowValue.substring(0, lastWord.toLowerCase().length) === lastWord.toLowerCase());
                                        }
                                    });

                                    if (matches.length <= 0) {
                                        //console.log(hostname);

                                        /*
                                        $.ajax({ url: hostname + "/api/search.php?q=" + lastLine + "&s=" + lastLine, success: function(data) {
                                                var searchResult = document.createElement("searchResult");searchResult.innerHTML = data;
                                                availableTags = JSON.parse(searchResult.innerText);

                                                console.log(availableTags);
                                                //availableTags.push("Test");
                                                response(availableTags);
                                            } });
                                            */

                                        var url2 = hostname + "api/search.php?q=" + lastWord + "&s=" + lastLine + "&space=0";
                                        console.log(url2);
                                        $.getJSON(url2, function (json) {
                                            availableTags = [];
                                            availableTags = json;
                                        //    console.log(availableTags);
                                            response(availableTags);
                                        })


                                    }


                                }
                            }


                        }
                        updateStatistics();
                    }

                }
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {

                var str = document.getElementById("textarea").value;

                console.log("STRING: " + str);

                if (str.slice(-1) == " ") {
                    str = str.substring(0, (str.length - word.length) - 1);
                } else {
                    str = str.substring(0, (str.length - word.length));
                }

                console.log("SUBSTRING: " + str);

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
                var countSaved = currentCountofKeystrokesSaved + Number(ui.item.value.length - lastWord.length);
                console.log("Words: " + lastWord + " - " + ui.item.value + " | Saved: " + countSaved);
                document.getElementById("keystrokesSaved").innerText = countSaved;


                // percent saved
                var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
                var percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100);
                document.getElementById("percentSaved").innerText = percentSaved.toString();

                return false;
            }
        });

});

function updateStatistics() {

    if (document.getElementById("textarea").value.length === 0) {
        document.getElementById("wordCounter").innerText = "0";
        document.getElementById("totalLength").innerText = "0";
        document.getElementById("keystrokesSaved").innerText = "0";
        document.getElementById("percentSaved").innerText = "0";
    } else {
        var totalLength = document.getElementById("textarea").value.length;
        document.getElementById("totalLength").innerText = totalLength;

        // percent saved
        var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
        var percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100);
        document.getElementById("percentSaved").innerText = percentSaved.toString();

        if (totalLength < 4) {
            document.getElementById("keystrokesSaved").innerText = "0";
            document.getElementById("percentSaved").innerText = "0";
        }

        // Count Words
        var matches = (document.getElementById("textarea").value).match(/[\w\d\’\'-]+/gi);
        var countWordsSaved = matches ? matches.length : 0;
        document.getElementById("wordCounter").innerText = countWordsSaved.toString();
    }
}

function onoff() {
    if (document.getElementById("myonoffswitch1").checked === true) {
        location.reload();
        //document.getElementById("quickHelp").style.display = "block";
        //document.getElementById("headerDiscovery").style.display = "block";
        //document.getElementById("knowledgeBox").style.display = "block";
        //document.getElementById("textareatd").style.width = "45%";
    } else {
        document.getElementById("quickHelp").style.display = "none";
        document.getElementById("headerDiscovery").style.display = "none";
        document.getElementById("knowledgeBox").style.display = "none";
        document.getElementById("textareatd").style.width = "100%";
    }

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

function createNodesEdges(name, textForSearch) {
 //   if (name!=='I"s') {

    if (nodes.length > 0) {
        nodes.add({id: nodes.length + 1, label: name, shape: 'box'});
        edges.add({from: 1, to: nodes.length});
        researchList.push(name);
        console.log(researchList);
    } else {
        nodes.add({id: nodes.length + 1, label: name, shape: 'box'});
        researchList.push(name);
        console.log(researchList);
    }

    //showNodeInfo();'
    if (initialNetworkVis>0) {
    network.focus(nodes.length + 1, {scale: 1.0});
    network.moveTo({position: {x: 0, y: 0}, scale: 1.0});
        addNodesAround(name, nodes.length, textForSearch);
    }


   //
 //   }
}

function addNodesAround(name, id, textForSearch) {

    //   console.log(textForSearch);

    try {
        var splitText = textForSearch.split(".js") ;
        textForSearch = splitText[0];
    } catch (e) {}



    var colorNodes = getRandColor(5);
/*
    var matches = (textForSearch).match(/[\w\d\’\'-]+/gi);
    var countWords = matches ? matches.length : 0;
    if (countWords === 1) {
        textForSearch =  "Word%20"+ textForSearch;
    }
*/
    //$.ajax({ url: hostname + "/api/google-knowledge-graph-api.php?d=1&q=" + name, success: function(data) {
    $.ajax({
        url: hostname + "/api/bing-text-analytics2.php?w=1&q=" + textForSearch , success: function (data) {

            var dataFinal = data.split("|");

            for (var forLoop1 = 0; forLoop1 < dataFinal.length; forLoop1++) {

                var nameForGraph = dataFinal[forLoop1];
                if (nameForGraph) {

                    var foundExist = 0;
                    for (var xx = 0; xx < nodes.length; xx++) {
                        var nameFinal = network.body.data.nodes._data[xx + 1].label.toLowerCase().trim();
                        if (nameForGraph.toLowerCase().trim() === nameFinal) {
                            foundExist++;
                        }
                    }
                    if (foundExist <= 0) {
                        nodes.add({id: nodes.length + 1, label: nameForGraph, shape: 'box', color: colorNodes});
                        var selectedArray = network.getSelectedNodes();


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
                var $this = $('#textarea');
                var offset = $this.offset();
                var width = $this.width();
                var height = $this.height();

                var centerX = offset.left + width / 2;
                var centerY = offset.top + height / 2;
*/
                //network.nodes.focus({id:id, x:0, y: 0});

                for (var xx = 1; xx < nodes.length; xx++) {
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
        network.focus(id, {scale: 1.0});
        network.moveTo({position: {x: 0, y: 0}, scale: 1.0});

}

function showKnowledgeGraph(id) {
    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };

   // var options = {};

    var options = {
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
    initialNetworkVis = initialNetworkVis+1;
    if (initialNetworkVis===1) {
    network = new vis.Network(container, data, options);
    }
    // var selectedArray = network.getSelectedNodes();


    /*
    network.on("selectNode", function (params) {
        var node = network.body.nodes[id];
        node.setOptions({
            selected: true
        });
    });
*/
    //   console.log("Selected Node: " + id);

    network.focus(id, {scale: 1.0});
    network.moveTo({position: {x: 0, y: 0}, scale: 1.0});
}

function showNodeInfo() {
    document.getElementById("shortHelp").innerHTML = "";

    var selectedArray = network.getSelectedNodes();
    var nodeObj = network.body.data.nodes._data[selectedArray[0]];
    console.log(selectedArray[0] + " - " + nodeObj.label); //nodeObj.label to get label
    var selectedNodeID = selectedArray[0];
    researchList.push(nodeObj.label);
    console.log(researchList);

    $.ajax({
        url: hostname + "/api/duckduckgo-api.php?q=" + nodeObj.label, success: function (data) {
            //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

            var dataFinal = data.split("|");

            if (dataFinal[0]) {


                document.getElementById("topHelp").innerHTML = ' <b> ' + dataFinal[0] + ' </b> <table id="DuckDuckGo"><tr><td><img src="' + " " + dataFinal[1] + '" width="100px"></td><td>' + " " + dataFinal[3] + ' &nbsp;<br><br>';

                if (dataFinal[5]) {
                    try {
                        for (var xx = 4; xx < dataFinal.length - 1; xx++) {
                            var dataFinal2 = dataFinal[xx].split(":");

                            if (dataFinal2[1].indexOf('local.js') < 0) {
                                if (dataFinal2[1].indexOf('""') < 0) {
                                    if (dataFinal2[1].indexOf('undefined') < 0) {
                                        document.getElementById("topHelp").innerHTML += " <b> " + dataFinal2[0] + " </b>: " + dataFinal2[1] + " &nbsp;<br>";
                                    }
                                }
                            }
                        }

                    } catch (e) {
                        console.log(e);
                    }
                }
                document.getElementById("topHelp").innerHTML += ' </td></tr></table>';


                var nameForGraph = dataFinal[0];
                if (nameForGraph) {

                    var foundExist = 0;
                    for (var xx = 0; xx < nodes.length; xx++) {
                        var nameFinal = network.body.data.nodes._data[xx + 1].label.toLowerCase().trim();
                        if (nameForGraph.toLowerCase().trim() === nameFinal) {
                            foundExist++;
                        }
                    }
                    //if (foundExist <= 0) {
                    //createNodesEdges(nameForGraph,dataFinal[3]);

                    if (nameForGraph!=='I"s') {
                        addNodesAround(nameForGraph, selectedArray[0], data.removeStopWords());
                    }
                    showKnowledgeGraph(selectedNodeID);


//                       network.focus(selectedArray[0],{scale: 1,offset: {x:0, y:0}});
                    //}
                }


            } else {

                $.ajax({
                   // url: hostname + "/api/bing-parser.php?q=" + nodeObj.label, success: function (data2) {
                    url: hostname + "/api/google-knowledge-graph-api.php?q=" + nodeObj.label, success: function (data2) {
                        //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                        if (data2) {
                            document.getElementById("topHelp").innerHTML = " <b> " + nodeObj.label + " </b> <br> " + data2 + " <br>";

                                addNodesAround(nodeObj.label, selectedArray[0], data2.removeStopWords());
                               showKnowledgeGraph(selectedNodeID);
                        }

                    }
                    });
            }

        }

    });

}

function getRandColor(brightness) {
    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
        return Math.round(x / 2.0)
    })
    return "rgb(" + mixedrgb.join(",") + ")";
}

function enableHighlighting() {
      var s = window.getSelection();
    var range = s.getRangeAt(0);
    var node = s.anchorNode;
    while (range.toString().indexOf(' ') != 0) {
        range.setStart(node, (range.startOffset - 1));
    }
    range.setStart(node, range.startOffset + 1);
    do {
        range.setEnd(node, range.endOffset + 1);

    } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
    var str = range.toString().trim();

    var wordHighligted = " " + str;
    wordHighligted = wordHighligted.replace(/\s\s+/g, ' ');
    wordHighligted = wordHighligted.replace(/ \s*$/, "");
    console.log("SELECTED: " + wordHighligted);

     $("#textarea").val($("#textarea").val().trim() + wordHighligted);


    var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
    var countSaved = currentCountofKeystrokesSaved + wordHighligted.length;
    document.getElementById("keystrokesSaved").innerText = countSaved;

    // percent saved
    var currentCountofKeystrokesSaved = Number(document.getElementById("keystrokesSaved").innerText);
    var percentSaved = Math.round(((currentCountofKeystrokesSaved * 100 / totalLength) * 100) / 100);
    document.getElementById("percentSaved").innerText = percentSaved.toString();


    updateStatistics();

    document.getElementById('textarea').focus();

};

function getTopHelp() {
    document.getElementById("shortHelp").innerHTML = "";

    var textEntryContent = document.getElementById("textarea").value;
    var arrayOfLines = textEntryContent.match(/[^\r\n]+/g);
    var lastLine = arrayOfLines.slice(-1)[0];
    if (lastLine.indexOf('.') > 0) {
        lastLine = lastLine.substring(lastLine.lastIndexOf('.') + 1);
        //  console.log("LAST SENTENCE: " + lastLine);
    } else {
        // console.log("LAST SENTENCE: " + lastLine);
    }

    //var spaceCount = (lastLine.removeStopWords().split(" ").length - 1);
    var spaceCount = (lastLine.split(" ").length - 1);
    console.log("spaceCount: " + spaceCount);

    var wordNotFound = 0;

/*
    var matches = (textEntryContent).match(/[\w\d\’\'-]+/gi);
    var countWords = matches ? matches.length : 0;
    if (countWords <= 2) {
        textEntryContent =  "Word%20"+ textEntryContent;
    }
*/
    $.ajax({
        url: hostname + "/api/bing-text-analytics2.php?w=0&q=" + textEntryContent, success: function (data) {
            //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

            var dataFinal = data.split("|");
            var lastRecognizedElement = dataFinal[dataFinal.length-2];


            var nameForGraph = lastRecognizedElement;
            if (nameForGraph) {

                $.ajax({
                    url: hostname + "/api/duckduckgo-api.php?q=" + nameForGraph, success: function (data) {
                        //$.ajax({ url: hostname + "/api/bing-text-analytics.php?q=" + lastLine, success: function(data) {

                        var dataFinal = data.split("|");

                        if (dataFinal[0]) {


                            var nameForGraph = dataFinal[0];
                            if (nameForGraph) {

                                var foundExist = 0;
                                for (var xx = 0; xx < nodes.length; xx++) {
                                    var nameFinal = network.body.data.nodes._data[xx + 1].label.toLowerCase().trim();
                                    if (nameForGraph.toLowerCase().trim() === nameFinal) {
                                        foundExist++;
                                        showKnowledgeGraph(xx+1);
                                        addNodesAround(nameForGraph,xx+1,data);
                                    }
                                }
                                if (foundExist <= 0) {
                                    if (nameForGraph[0] === nameForGraph[0].toUpperCase()) {
                                        createNodesEdges(nameForGraph, data);
                                        showKnowledgeGraph();
                                    }
                                }
                            }

                            document.getElementById("topHelp").innerHTML = ' <b> ' + dataFinal[0] + ' </b> <table id="DuckDuckGo"><tr><td><img src="' + dataFinal[1] + '" width="100px"></td><td>' + " " + dataFinal[3] + '  &nbsp;<br><br>';


                            try {
                                for (var xx = 4; xx < dataFinal.length; xx++) {
                                    var dataFinal2 = dataFinal[xx].split(":");
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
                            document.getElementById("topHelp").innerHTML += ' </td></tr></table>';
                            wordNotFound = 1;
                        } else {
                            if (nameForGraph){
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
                        }

                    }
                });


            }

            //  document.getElementById("topHelp").innerHTML = dataFinal[1].trim();
        }
    });

    if (spaceCount >= 1) {
        var url2 = hostname + "api/bing-parser.php?q=" + lastLine;
        console.log(url2);
        $.get(url2, function (json) {
            json = json + '. ';
            var sentenceArray = json.split(". ")
            var firstSentence = sentenceArray[0];
            //if ((json.length > 2) && (json.length < 25)) {
                if (json.length > 2) {

                   firstSentence = firstSentence.split(' ').slice(0,10).join(' ');

                if (firstSentence.slice(-3) === "...") {
                    firstSentence = firstSentence.substring(0, firstSentence.length-3);
                }

                if (firstSentence.slice(-2) === ", ") {
                    firstSentence = firstSentence.substring(0, firstSentence.length-2);
                }

                if (firstSentence.slice(-1) === ",") {
                    firstSentence = firstSentence.substring(0, firstSentence.length-1);
                }

                if (firstSentence.indexOf("Image:") < 0) {
                    console.log(researchSentences);
                    if (arrayContains(firstSentence,researchSentences) === false) {
                        document.getElementById("shortHelp").innerHTML = " Hint: " + firstSentence + " <br> "; // check for last 3 words
                        researchSentences.push(firstSentence);
                    }


                } else {
                    var firstSentence2 = splitMulti(firstSentence, ['.com', '.net', '.org', '.com', '.edu', '.gov', '.uk', '.au']);

                    firstSentence = firstSentence2[1];
                    console.log(researchSentences);
                    if (arrayContains(firstSentence,researchSentences) === false) {
                        document.getElementById("shortHelp").innerHTML = " Hint: " + firstSentence + " <br> ";
                        researchSentences.push(firstSentence);
                    }

                }


                // try if help comes up with something from wikipedia
                var wikiLink = firstSentence;

                if (hasNumber(wikiLink)===false) {
              //  var wikiLink2 = firstSentence.replace(/[0-9]/g, '');
               // wikiLink2 = wikiLink2.split(/jan/i).join('').split(/feb/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('').split(/jan/i).join('');


                $.ajax({
                    url: hostname + "/api/wikipedia-api.php?q=" + wikiLink, success: function (data) {
                        console.log("Wikipedia:" + data);
                        console.log(researchSentences);
                        wikiLink = data;
                        if (arrayContains(data,researchSentences) === false) {
                            if (data.toLowerCase().indexOf("undefined")<0) {
                            document.getElementById("shortHelp").innerHTML = " Hint: " + data + " <br> ";
                            researchSentences.push(data);
                            }
                        }
                    }
                    });



                        console.log("Wiki: " + wikiLink);
            }}
        });
    }





}

function getLastWord(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    return str.trim().split(" ").reverse()[0];
}

function getLastTwoWords(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    return str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
}

function getLastThreeWords(str) {
    // strip punctuations
    str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
    str = str.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    // get the last word
    return str.trim().split(" ").reverse()[2] + " " + str.trim().split(" ").reverse()[1] + " " + str.trim().split(" ").reverse()[0];
}

function splitMulti(str, tokens) {
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for (var i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}

String.prototype.removeStopWords = function () {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = new Array(
        'a',
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
        'z'
    )

    // Split out all the individual words in the phrase
    var words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g);
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
}

// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function () {
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function () {
        var minRows = this.getAttribute('data-min-rows') | 0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows + 1;
    });

function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}
function hasNumber(myString) {
    return /\d/.test(myString);
}

/*

$(document).keydown(function(e){
    updateStatistics();
});

function stripHtml(html) {
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}



*/