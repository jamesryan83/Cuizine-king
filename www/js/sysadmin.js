"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// Sysadmin
app.sysadmin = {

    htmlFiles: {}, // cached html


    init: function (html) {
        var self = this;

        this.htmlFiles = html;

        // setup router
        app.routerBase.init();

        app.routerBase.loadPageForRoute(null, "sysadmin");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {

        // logout button
        $("#navbar-link-logout").on("click", function () {
            app.routerBase.logUserOut();
        });
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        // not needed so return route
        return { route: route, match: true };
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

