<?php
// Google Api key is in the below file in variable: $google_maps_api
include("api/credentials.php");

?>
<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Text Entry Assistive Cloud-Based Platform</title>
    <meta name="description"
          content="The primary goal of this alpha prototype is to create a real-time text analysis engine which inspects the entered text and offers predictive suggestions to the end user.
The project claims that the smart predictive technologies can speed up the text entry process, as well as improve user experience and overall user productivity.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
    <link rel="stylesheet" href="http://yandex.st/jquery/fancybox/2.1.4/jquery.fancybox.css">

    <link rel="stylesheet" href="css/main.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="http://yandex.st/jquery/fancybox/2.1.4/jquery.fancybox.min.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php echo $google_maps_api;?>"></script>


    <script src="http://www.geoplugin.net/javascript.gp" type="text/javascript"></script>
    <script src="js/main.js"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>


</head>

<body onload="onload()" spellcheck="false">


<div class="content">


    <!--[if lte IE 9]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a
            href="https://browsehappy.com/">upgrade
        your browser</a> to improve your experience and security.</p>
    <![endif]-->

    <!-- Add your site or application content here -->

    <br>
    <div id="header"><b>Text Entry Assistive Cloud-Based Platform (1.1)</b></div>
    <small style="text-align: center;">The primary goal of this alpha prototype is to create a real-time text analysis engine that based on inspection of
        entered text offers predictive suggestions to the end user.<br>The project claims that the smart predictive technologies can speed up the text entry
        process, as well as improve user experience and overall user productivity.
        <br> <b>Supported Browsers: </b>Google Chrome Version 67 and higher.
    </small>
    <br><br>

    <table style="table-layout: fixed">
        <tr>
            <td rowspan="2"
                style="width: 192px;background: #fffef2;padding: 10px;max-width: 192px;word-wrap:break-word; vertical-align: top;text-align: left;">

                <div id="configuration">

                    <h4>Approx. Location</h4>


                    <table>
                        <tbody>
                        <tr>
                            <input id="location" type="text" style="width:100%" disabled>
                            <br>
                            Lat:<input id="latit" type="text" style="width:30%" disabled>
                            Long:<input id="longi" type="text" style="width:30%" disabled></td>
                        </tr>

                        <input type="button" disabled id="fancybutton" value="Show Map"/>
                        <div style="width:0px;height:0px">
                            <div id="map_canvas" style="width:100%;height:100%"></div>
                        </div>

                    </table>


                    <br>

                    <h4>Configuration</h4>

                    <select id="calculation_Type">
                        <option value="all">Combinations [slow]</option>
                        <option selected value="random">Random [faster]</option>
                    </select>
                    <br>

                    <h4>Rate</h4>
                    <select id="errorRate" onkeyup="calculateTotals()">
                        <option selected value=0>0</option>
                        <option value=4>4</option>
                        <option value=8>8</option>
                        <option value=12>12</option>
                        <option value=16>16</option>
                        <option value=20>20</option>
                    </select>


                    <br>
                </div>


            </td>
            <td style="width: 650px;vertical-align:top;padding: 25px;background: #eafff8;">


                <table>
                    <tbody>
                    <tr>
                        <td>

                            <br><b>Enter text into box below!</b> (use TAB key to utilize provided real-time suggestions)


                            <br>


                            <div class="ui-widget">

                                <div id="textentry" contentEditable="true"></div>
                                <br>
                                <!--<lable id="justText" style="visibility:hidden"></lable>-->

                            </div>



                            <br><br>
                               <b>Real-Time Text Analysis:</b>


                            <div>
                                <div class="labelbox">Spelling Corrections

                                </div>

                                <div class="labelbox">Suggestions

                                </div>

                                <div class="labelbox">Places

                                </div>




                                <div id="spelling">

                                </div>

                                <div id="people">

                                </div>

                                <div id="places">

                                </div>
                            </div>



                            <lable id="textAnalysis"></lable>


                </table>


            </td>
        </tr>
        <tr>
            <td style="vertical-align:middle;padding: 20px;background: #fff2f9;">

                <small> Dissertation Project by JJ(H00058995). Licensing: GNU Affero General Public License v3.0.</small>


            </td>
        </tr>

    </table>


    <br><br><br>
    <hr style="text-align:right;width:364px;position: fixed;padding:10px;bottom: 0;right: 0;">
    <small style="position: fixed;bottom: 0;right: 0;padding:10px;color:black">
        ©
        <script>document.write(new Date().getFullYear())</script>
        - Jozef Jarosciak - Open Source on <a href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform" target="_blank">GitHub</a>
        under <a href="https://github.com/JozefJarosciak/Text_Entry_Assistive_Cloud-Based_Platform/blob/master/LICENSE.md" target="_blank">AGPL-3.0</a> license.
        <br>
    </small>


    <noscript>
        <div class="statcounter"><a title="Web Analytics
Made Easy - StatCounter" href="http://statcounter.com/"
                                    target="_blank"><img class="statcounter"
                                                         src="//c.statcounter.com/11598702/0/b9249090/1/" alt="Web
Analytics Made Easy - StatCounter"></a></div>
    </noscript>
    <!-- End of StatCounter Code for Default Guide -->


</div>
</body>
</html>