"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// Site pages
app.site = {

    htmlFiles: {}, // cached html

    regexUrlAccount: /\/account\/\d*/,
    regexUrlLocation: /\/location\/[\w\d%-]*-\d*/,
    regexUrlStore: /\/store\/\d*/,


    init: function (html) {
        var self = this;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        this.htmlFiles = html;

        // setup router
        app.routerBase.init();


        // setup dialogs
        app.dialogs.description.init();
        app.dialogs.businessHours.init();
        app.dialogs.reviews.init();

        app.routerBase.loadPageForRoute(null, "site");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.site.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;

        if (this.regexUrlStore.exec(route)) {
            route = "/store/:id";
            match = true;
        } else if (this.regexUrlLocation.exec(route)) {
            route = "/location/:suburb";
            match = true;
        } else if (this.regexUrlAccount.exec(route)) {
            route = "/account/:id";
            match = true;
        }

        return { route: route, match: match };
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
