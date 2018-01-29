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

        // logout button
        $("#navbar-link-logout").on("click", function () {
            app.routerBase.logUserOut();
        });
    },


    // System admin routes
    routes: {
        "/sysadmin/create-store": {
            title: "SysAdmin - Create Store",
            file: "create-store",
            initFunction: function (routeData) {
                app.sysadmin.createStore.init(routeData);
            },
        },
        "/sysadmin/edit-store": {
            title: "SysAdmin - Edit Store",
            file: "edit-store",
            initFunction: function (routeData) {
                app.sysadmin.editStore.init(routeData);
            },
        },
        "/sysadmin/database": {
            title: "SysAdmin - Database",
            file: "database",
            initFunction: function (routeData) {
                app.sysadmin.database.init(routeData);
            },
        },
    }

}


// create arrays of filepaths for express router
app.sysadmin.routesList = Object.keys(app.sysadmin.routes);

if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.sysadmin;
}

