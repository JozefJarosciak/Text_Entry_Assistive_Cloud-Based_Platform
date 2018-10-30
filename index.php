<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Text Entry Assistive Cloud-Based Platform</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/jquery.mark.min.js"></script>
    <script src="js/vis.min.js"></script>
    <script src="js/main.js"></script>

    <link rel="stylesheet" href="css/main.css" type="text/css">
    <link rel="stylesheet" href="css/vis-network.min.css" type="text/css"/>

</head>

<body>


<div class="box">



    <div class="row header">

        <table id="topHeaderTable">
            <tr>
                <td> <h2>Text Entry Assistive Cloud-Based Platform</h2></td>
                <td><table id="statsBox">
                        <tr>
                            <th align="left">
                                <small>Creative Writing</small>
                            </th>
                            <th align="left">
                                <small>Transcription</small>
                            </th>
                            <th align="left">
                                <small>KeyPress Count</small>
                            </th>
                            <th align="left">
                                <small>Word Count</small>
                            </th>
                            <th align="left">
                                <small>Saved Keystrokes</small>
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="creativeWritingSwitch" class="onoffswitch-checkbox" id="creativeWritingSwitch" onclick="creativeWritingOnOff()" checked>
                                    <label class="onoffswitch-label" for="creativeWritingSwitch">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="transcriptionSwitch" class="onoffswitch-checkbox" id="transcriptionSwitch" onclick="transcriptionOnOff()" checked>
                                    <label class="onoffswitch-label" for="transcriptionSwitch">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </td>
                            <td style="background-color:#f3f3f3;border:1px solid #cecece;">
                                <b><label id="totalLength">0</label></b>
                            </td>

                            <td style="background-color:#f3f3f3;border:1px solid #cecece;">
                                <b><label id="wordCounter">0</label></b>
                            </td>

                            <td style="background-color:#f3f3f3;border:1px solid #cecece;">
                                <b><label id="keystrokesSaved">0</label></b> (<label id="percentSaved">0</label>%)
                            </td>
                        </tr>
                    </table></td>
            </tr>
        </table>






<br>

        <div id="transcribeTextWrapper">
            <b>&nbsp;Transcribe the following randomly selected words or </b><button onclick="getRandomWords()">Select Different Words</button>
            <br><br>
            <div id="transcribeText"></div><br>
        </div>



        <table id="topTable">
            <tr>
                <th><h3>ENTER TEXT</h3> <small id="detailHeader">(use ENTER and ↑↓ arrows to utilize the real-time suggestions)</small></th>
                <th id="headerDiscovery"><h3>DETAILS</h3> <small id="detailHeader">(click words to add them to text editor)</small></th>
            </tr>
            <tr>
                <td id="textareatd" style="width:45%;">

                    <div id="appendEnabled">
                        <div id="shortHelp" onclick="enableHighlighting()"></div>
                        <textarea id='textarea' spellcheck="false"></textarea>
                    </div>
                </td>
                <td id="quickHelpCell">
                    <div id="quickHelp">
                       <small>
                            <span id="topHelp" onclick="enableHighlighting()">
                            </span>
                        </small>
                    </div>

                </td>
            </tr>
        </table>







    </div>

    <div id="similarityCalculationWrapper">
    <table id="detailStat" style="width: 98%">
        <tbody>
     <tr>
         <td>
             <b>Completed:</b>
             <div id="similarityCalculation">0%</div>
         <td>
             <b>Time:</b>
             <div id="output2">00:00:00</div>
         </td>
     </tr>
        </tbody>
    </table>
        <div id="resultToSend"></div><br><br>
    </div>









    <div class="row content" id="knowledgeBox">
        <h3>RESEARCH AREA <small id="detailHeader">(double click the nodes to load details | drag to re-arrange)</small></h3>
        <div id="mynetwork" ondblclick="showNodeInfo()"></div>
    </div>



    <div class="row footer">
        <small><b>Thesis:</b> JJ-H00058995; <b>Requirements:</b> Chrome 69+, Min. Resolution: 1024x768; <a
                    href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform" target="_blank">Open Source</a>
            under <a href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform/blob/master/LICENSE.md" target="_blank">AGPL-3.0</a>
            ; ©
            <script>document.write(new Date().getFullYear())</script>
            J.Jarosciak.
        </small>

        </div>




</div>

</body>

</html>
