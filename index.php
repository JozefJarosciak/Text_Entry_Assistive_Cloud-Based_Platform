<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"/>
    <title>Text Entry Assistive Cloud-Based Platform</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <script src="js/main.js"></script>
    <link rel="stylesheet" href="css/main.css">
</head>

<body>


<div id="entirePage">


    <h1>Text Entry Assistive Cloud-Based Platform</h1>
    <small><b>Dissertation:</b> H00058995; <b>Requirements:</b> Chrome 69+, Resolution: 800x600; <a href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform" target="_blank">Open Source</a>
        under <a href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform/blob/master/LICENSE.md" target="_blank">AGPL-3.0</a>
        ; © <script>document.write(new Date().getFullYear())</script> J.Jarosciak.
        <br>
    </small>
    <br>



    <table style="width:650px;align-text: left;">
        <tr>
            <th align="left">
                <small>Suggestions</small>
            </th>
            <th align="left">
                <small>Quick Help</small>
            </th>
            <th align="left">
                <small>Analytics</small>
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
                    <input type="checkbox" name="onoffswitch1" class="onoffswitch-checkbox" id="myonoffswitch1" onchange="onOffSwitch()" checked>
                    <label class="onoffswitch-label" for="myonoffswitch1">
                        <span class="onoffswitch-inner"></span>
                        <span class="onoffswitch-switch"></span>
                    </label>
                </div>
            </td>
            <td>
                <div class="onoffswitch">
                    <input type="checkbox" name="onoffswitch2" class="onoffswitch-checkbox" id="myonoffswitch2" onchange="onOffSwitch()" checked>
                    <label class="onoffswitch-label" for="myonoffswitch2">
                        <span class="onoffswitch-inner"></span>
                        <span class="onoffswitch-switch"></span>
                    </label>
                </div>
            </td>
            <td>
                <div class="onoffswitch">
                    <input type="checkbox" name="onoffswitch3" class="onoffswitch-checkbox" id="myonoffswitch3" onchange="onOffSwitch()" checked>
                    <label class="onoffswitch-label" for="myonoffswitch3">
                        <span class="onoffswitch-inner"></span>
                        <span class="onoffswitch-switch"></span>
                    </label>
                </div>
            </td>
            <td style="background: ivory">
                <b><label id="totalLength">0</label></b>
            </td>

            <td style="background: ivory">
                <b><label id="wordCounter">0</label></b>
            </td>

            <td style="background: ivory">
                <b><label id="keystrokesSaved">0</label></b> (<label id="percentSaved">0</label>%)
            </td>
        </tr>
    </table>


    <br>

    <b>Enter Text!</b>
    <small>(use TAB/ENTER and ↑↓ arrows to utilize the real-time suggestions)</small>

    <div id="appendEnabled">
    <textarea class='autoExpand' rows='3' data-min-rows='3' id='textarea'></textarea>
        </div>

    <div id="spacer"></div>

    <div id="quickHelpWrapper">
        <br><small><b>Quick Help</b></small>
        <div id="quickHelp">
            <small><div id="topHelp" ondblclick="enableHighlighting()">
            </div></small>
        </div>
    </div>


    <br>
    <div id="analyticsWrapper">
        <small><b>Analytics</b></small>
        <div id="wrapper">
            <div id="leftcolumn">
                <b style="font-size:14px">Discovered Terms</b>
            </div>
            <div id="rightcolumn">

            </div>
        </div>
    </div>





</div>

</body>

</html>
