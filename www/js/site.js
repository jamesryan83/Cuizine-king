"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};


if (typeof window != "undefined") {
    $(document).ready(function () {
        app.site.init();
    });
}


// Site pages
app.site = {


    htmlFiles: {}, // cached html


    init: function () {
        var self = this;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);


        // setup router
        app.routerBase.init();


        // setup dialogs
        app.dialogs.description.init();
        app.dialogs.businessHours.init();
        app.dialogs.reviews.init();


        // Load the html json file
        $.getJSON("/generated/_site.json", function (data) {
            self.htmlFiles = data;

            var routeData = app.routerBase.loadPageForRoute(null, "site");

        }).fail(function (err) {
            // TODO : error msg
        });
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.navbar.init(routeData);
    },


    // Site routes
    routes: {
        "/": {
            title: "Home", // browser tab title
            file: "home", // filename
            initFunction: function (routeData) {
                app.site.home.init(routeData);
            },
        },
        "/account/:id": {
            title: "Account",
            file: "account",
            initFunction: function (routeData) {
                app.site.account.init(routeData);
            },
        },
        "/about": {
            title: "About",
            file: "about",
            initFunction: function (routeData) {

            },
        },
        "/help": {
            title: "Help",
            file: "help",
            initFunction: function (routeData) {

            },
        },
        "/location/:suburb": {
            title: "Location",
            file: "location",
            initFunction: function (routeData) {
                app.site.location.init(routeData);
            },
        },
        "/store/:id": {
            title: "Store",
            file: "store",
            initFunction: function (routeData) {
                app.site.store.init(routeData);
            },
        },

        "/login": {
            title: "Login",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/store-login": {
            title: "Store Login",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/verify-account": {
            title: "Verify Account",
            file: "verify-account",
            initFunction: function (routeData) {
                app.site.verifyAccount.init(routeData);
            },
        },
        "/reset-password": {
            title: "Reset Password",
            file: "reset-password",
            initFunction: function (routeData) {
                app.site.resetPassword.init(routeData);
            },
        },
        "/register": {
            title: "Register",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/store-application": {
            title: "Store Application",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
    }

}


// create arrays of filepaths for express router
app.site.routesList = Object.keys(app.site.routes);

if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.site;
}
