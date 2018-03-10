"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// CMS pages
app.cms = {

    htmlFiles: {}, // cached html

    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,


    init: function (html) {

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        this.htmlFiles = html;

        app.util.setupTemplateFormatters();

        // Dialogs
        app.dialogs.init();

        // setup router
        app.routerBase.init();

        app.routerBase.loadPageForRoute(null, "cms");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.cms.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;
        var newRoute = route;

        if (this.regexUrlStoreAdmin.exec(route)) {
            newRoute = newRoute.split("/");
            newRoute = "/store-admin/:id/" + newRoute[newRoute.length - 1];
            match = true;
        }

        return { route: newRoute, match: match };
    },


    // CMS routes
    routes: {
        "/store-admin/:id/business": {
            file: "business",
            initFunction: function (routeData) {
                document.title = app.Strings.business;
                app.cms.business.init(routeData);
            },
        },
        "/store-admin/:id/dashboard": {
            file: "dashboard",
            initFunction: function (routeData) {
                document.title = app.Strings.dashboard;
                app.cms.dashboard.init(routeData);
            },
        },
        "/store-admin/:id/delivery-suburbs": {
            file: "delivery-suburbs",
            initFunction: function (routeData) {
                document.title = app.Strings.deliverySuburbs;
                app.cms.deliverySuburbs.init(routeData);
            },
        },
        "/store-admin/:id/menu": {
            file: "menu",
            initFunction: function (routeData) {
                document.title = app.Strings.menu;
                app.cms.menu.init(routeData);
            },
        },
        "/store-admin/:id/orders": {
            file: "orders",
            initFunction: function (routeData) {
                document.title = app.Strings.orders;
                app.cms.orders.init(routeData);
            },
        },
        "/store-admin/:id/details": {
            file: "details",
            initFunction: function (routeData) {
                document.title = app.Strings.details;
                app.cms.details.init(routeData);
            },
        },
        "/store-admin/:id/transactions": {
            file: "transactions",
            initFunction: function (routeData) {
                document.title = app.Strings.transactions;
                app.cms.transactions.init(routeData);
            },
        },
    },

}


app.cms.routesList = Object.keys(app.cms.routes);


if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.cms;
}

