"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// Sysadmin
app.sysadmin = {

    htmlFiles: {}, // cached html


    init: function (html) {

        this.htmlFiles = html;


        // Dialogs
        app.dialogs.init();

        // setup router
        app.routerBase.init();

        app.routerBase.loadPageForRoute(null, "sysadmin");
    },


    // Called whenever the page is changed
    onPageChanged: function () {

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
            file: "create-store",
            initFunction: function (routeData) {
                document.title = "SysAdmin - Create Store";
                app.sysadmin.createStore.init(routeData);
            },
        },
        "/sysadmin/edit-store": {
            file: "edit-store",
            initFunction: function (routeData) {
                document.title = "SysAdmin - Edit Store";
                app.sysadmin.editStore.init(routeData);
            },
        },
        "/sysadmin/database": {
            file: "database",
            initFunction: function (routeData) {
                document.title = "SysAdmin - Database";
                app.sysadmin.database.init(routeData);
            },
        },
    }

}


app.sysadmin.routesList = Object.keys(app.sysadmin.routes);


if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.sysadmin;
}

