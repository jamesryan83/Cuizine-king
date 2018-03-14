"use strict";

// this script is used in main.html as the startupScript
var app = app || app;

// load page resources
$(document).ready(function () {

    var $pageContainer = $("#page-container");


    // Initial ajax request
    $.ajax({
        method: "POST",
        url: "/page-request",
        data: { encodedUrl: encodeURI(window.location.pathname) },
        beforeSend: function(request) {
            request.setRequestHeader("authorization", "Bearer " + localStorage.getItem("jwt"));
        },
        success: function (result) {
            if (!result.html || !result.css || !result.js || !result.section) {
                $pageContainer.append($("<p style='margin: 30px'>Error loading data.  Please refresh the page</p>")[0]);
                return;
            }

            afterInitialAjax(result);
        },
        error: function (err) {
            if (err) console.log(err);

            $pageContainer.append($("<h3 id='error-index-h' style='margin: 30px'>Error.  Please refresh the page</h3>")[0]);
            $pageContainer.append($("<a id='error-index-a' href='/'>Click here to go home</a>")[0]);
        }
    });


    // after initial ajax request
    function afterInitialAjax(result) {
        // load css
        document.getElementsByTagName('head')[0]
            .appendChild($("<link rel='stylesheet' href='" + result.css + "' />")[0]);

        // load js file
        $.ajax({
            dataType: "script",
            cache: true,
            url: result.js,
            success: function () {

//                var intervalCount = 0;
//                var interval = setInterval(function () {
//                    if (typeof app !== "undefined") {
//                        console.log("loading scripts...");
//                        intervalCount++;
//                        if (intervalCount > 100) {
//                            alert("Page error.  Please try refreshing");
//                            clearInterval(interval);
//                        }
//
//                        return;
//                    }
//
//                    clearInterval(interval);

                    // localized strings
                    app.Strings = result.strings;

                    // pass html to js
                    app[result.section].init(JSON.parse(result.html));


//                }, 200);


            },
            error: function () {
                console.log(err);
                $pageContainer.append($("<p style='margin: 30px'>Error loading scripts.  Please refresh the page</p>")[0]);
            }
        });
    }


});