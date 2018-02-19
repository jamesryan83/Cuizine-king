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
            title: "Business",
            file: "business",
            initFunction: function (routeData) {
                app.cms.business.init(routeData);
            },
        },
        "/store-admin/:id/dashboard": {
            title: "Dashboard",
            file: "dashboard",
            initFunction: function (routeData) {
                app.cms.dashboard.init(routeData);
            },
        },
        "/store-admin/:id/delivery-suburbs": {
            title: "Delivery Suburbs",
            file: "delivery-suburbs",
            initFunction: function (routeData) {
                app.cms.deliverySuburbs.init(routeData);
            },
        },
        "/store-admin/:id/menu": {
            title: "Menu",
            file: "menu",
            initFunction: function (routeData) {
                app.cms.menu.init(routeData);
            },
        },
        "/store-admin/:id/orders": {
            title: "Orders",
            file: "orders",
            initFunction: function (routeData) {
                app.cms.orders.init(routeData);
            },
        },
        "/store-admin/:id/details": {
            title: "Details",
            file: "details",
            initFunction: function (routeData) {
                app.cms.details.init(routeData);
            },
        },
        "/store-admin/:id/transactions": {
            title: "Transactions",
            file: "transactions",
            initFunction: function (routeData) {
                app.cms.transactions.init(routeData);
            },
        },
    },

}



// create arrays of filepaths for express router
app.cms.routesList = Object.keys(app.cms.routes);

if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.cms;
}

