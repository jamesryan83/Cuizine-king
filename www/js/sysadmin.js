"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};


if (typeof window != "undefined") {
    $(document).ready(function () {
        app.sysadmin.init();
    });
}


// Sysadmin
app.sysadmin = {

    htmlFiles: {}, // cached html


    init: function (routeData) {
        var self = this;

        app.routerBase.init();

        // Load the html json file
        $.getJSON("/generated/_sysadmin.json", function (data) {
            self.htmlFiles = data;

            app.routerBase.loadPageForRoute(null, "sysadmin");
        }).fail(function (err) {
            // TODO : error msg
        });

    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {

    },


    // CMS routes
    routes: {
        "/sysadmin": {
            title: "System Admin",
            file: "sysadmin",
            initFunction: function (routeData) {
                app.sysadmin.main.init();
            },
        },
    }

}


// create arrays of filepaths for express router
app.sysadmin.routesList = Object.keys(app.sysadmin.routes);

if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.sysadmin;
}

