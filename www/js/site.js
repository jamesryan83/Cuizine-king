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

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        this.htmlFiles = html;

        app.util.setupTemplateFormatters();

        // Dialogs
        app.dialogs.init();

        // setup router
        app.routerBase.init();

        app.routerBase.loadPageForRoute(null, "site");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.site.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;
        var newRoute = route;

        if (this.regexUrlStore.exec(route)) {
            newRoute = "/store/:id";
            match = true;
        } else if (this.regexUrlLocation.exec(route)) {
            newRoute = "/location/:suburb";
            match = true;
        } else if (this.regexUrlAccount.exec(route)) {
            newRoute = "/account/:id";
            match = true;
        }

        return { route: newRoute, match: match };
    },


    // Site routes
    routes: {
        "/": {
            file: "home", // filename
            initFunction: function (routeData) {
                document.title = app.Strings.home;
                app.site.home.init(routeData);
            },
        },
        "/account/:id": {
            file: "account",
            initFunction: function (routeData) {
                document.title = app.Strings.account;
                app.site.account.init(routeData);
            },
        },
        "/about": {
            file: "about",
            initFunction: function () {
                document.title = app.Strings.about;
            },
        },
        "/help": {
            file: "help",
            initFunction: function () {
                document.title = app.Strings.help;
            },
        },
        "/location/:suburb": {
            file: "location",
            initFunction: function (routeData) {
                document.title = app.Strings.location;
                app.site.location.init(routeData);
            },
        },
        "/store/:id": {
            file: "store",
            initFunction: function (routeData) {
                document.title = app.Strings.store;
                app.site.store.init(routeData);
            },
        },

        "/login": {
            file: "login",
            initFunction: function (routeData) {
                document.title = app.Strings.login;
                app.site.login.init(routeData);
            },
        },
        "/store-login": {
            file: "login",
            initFunction: function (routeData) {
                document.title = app.Strings.storeLogin;
                app.site.login.init(routeData);
            },
        },
        "/verify-account": {
            file: "verify-account",
            initFunction: function (routeData) {
                document.title = app.Strings.verifyAccount;
                app.site.verifyAccount.init(routeData);
            },
        },
        "/reset-password": {
            file: "reset-password",
            initFunction: function (routeData) {
                document.title = app.Strings.resetPassword;
                app.site.resetPassword.init(routeData);
            },
        },
        "/register": {
            file: "login",
            initFunction: function (routeData) {
                document.title = app.Strings.resetPassword;
                app.site.login.init(routeData);
            },
        },
        "/store-application": {
            file: "login",
            initFunction: function (routeData) {
                document.title = app.Strings.storeApplication;
                app.site.login.init(routeData);
            },
        },
    }

}


app.site.routesList = Object.keys(app.site.routes);


if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.site;
}
