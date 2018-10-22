<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Text Entry Assistive Cloud-Based Platform</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
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
                <td> <h4>Text Entry Assistive Cloud-Based Platform</h4></td>
                <td style="vertical-align: middle;"><table id="statsBox">
                        <tr>
                            <th align="left">
                                <small>Suggestions</small>
                            </th>
                            <th align="left">
                                <small>Character Count</small>
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
                                    <input type="checkbox" name="onoffswitch1" class="onoffswitch-checkbox" id="myonoffswitch1" checked>
                                    <label class="onoffswitch-label" for="myonoffswitch1">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <b><label id="totalLength">0</label></b>
                            </td>

                            <td>
                                <b><label id="wordCounter">0</label></b>
                            </td>

                            <td>
                                <b><label id="keystrokesSaved">0</label></b> (<label id="percentSaved">0</label>%)
                            </td>
                        </tr>
                    </table></td>
            </tr>
        </table>






<br>

        <table id="topTable">
            <tr>
                <th><h3>Enter Text!</h3> <small id="detailHeader">(use TAB/ENTER and ↑↓ arrows to utilize the real-time suggestions)</small></th>
                <th><h3>Discovery Panel</h3> <small id="detailHeader">(double click words to add it to text editor)</small></th>
            </tr>
            <tr>
                <td style="width:45%;">

                    <div id="appendEnabled">
                        <textarea id='textarea'></textarea>
                    </div>
                </td>
                <td id="quickHelpCell">
                    <div id="quickHelp">
                        <small>
                            <div id="topHelp" onclick="enableHighlighting()">
                            </div>
                        </small>
                    </div>

                </td>
            </tr>
        </table>







    </div>

    <div class="row content">
        <h3>Knowledge/Relationship Graph</h3> <small id="detailHeader">(double click the nodes to load details | drag to re-arrange)</small>
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
