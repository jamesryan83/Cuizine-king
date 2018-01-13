"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};


if (typeof window != "undefined") {
    $(document).ready(function () {
        app.cms.init();
    });
}


// CMS pages
app.cms = {


    htmlFiles: {}, // cached html


    init: function () {
        var self = this;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);


        app.routerBase.init();


        // Load the html json file
        $.getJSON("/generated/_cms.json", function (data) {
            self.htmlFiles = data;

            app.routerBase.loadPageForRoute(null, "cms");
        }).fail(function (err) {
            // TODO : error msg
        });


    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {

    },


    // CMS routes
    routes: {
        "/store/:id/business": {
            title: "Business",
            file: "business",
            initFunction: function () {
                app.cms.business.init();
            },
        },
        "/store/:id/dashboard": {
            title: "Dashboard",
            file: "dashboard",
            initFunction: function () {
                app.cms.dashboard.init();
            },
        },
        "/store/:id/delivery-suburbs": {
            title: "Delivery Suburbs",
            file: "delivery-suburbs",
            initFunction: function () {
                app.cms.deliverySuburbs.init();
            },
        },
        "/store/:id/menu": {
            title: "Menu",
            file: "menu",
            initFunction: function () {
                app.cms.menu.init();
            },
        },
        "/store/:id/orders": {
            title: "Orders",
            file: "orders",
            initFunction: function () {
                app.cms.orders.init();
            },
        },
        "/store/:id/settings": {
            title: "Settings",
            file: "settings",
            initFunction: function () {
                app.cms.settings.init();
            },
        },
        "/store/:id/transactions": {
            title: "Transactions",
            file: "transactions",
            initFunction: function () {
                app.cms.transactions.init();
            },
        },
    }

}



// create arrays of filepaths for express router
app.cms.routesList = Object.keys(app.cms.routes);

if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.cms;
}

