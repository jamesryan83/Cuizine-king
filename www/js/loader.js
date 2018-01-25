"use strict";

var app = app || {};

$(document).ready(function () {
    var section = $("#section").val();

    // check section name is kind of valid
    if (section && section.length > 2 && section.length < 10) {
        var scriptUrl = "/generated/_" + section + ".js";

        // check if authorized
        app.util.checkToken(function (err) {
            if (err) {
                return window.location.href = "/login";
            }

            console.log("authorized");

            console.log($("#page-container").children().length)

            // load script for section
            app.util.ajaxRequest({
                method: "GET", url: scriptUrl, auth: true, cache: true
            }, function (err) {
                if (err) {
                    window.location.href = "/login";
                    return;
                }

                console.log("script loaded");
            });
        });
    }
});