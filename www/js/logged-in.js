"use strict";

var app = app || {};


// Logged in pages
// These are called from client-router
app.loggedIn = {

    initialized: false,


    init: function () {
        this.initialized = true;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);
    },


    dashboardPage: function () {
        app.main.dashboard.init();
    },


    ordersPage: function () {
        app.main.orders.init();
    },


    deliverySuburbsPage: function () {
        app.main.deliverySuburbs.init();
    },


    menuPage: function () {
        app.main.menu.init();
    },


    transactionsPage: function () {
        app.main.transactions.init();
    },


    businessPage: function () {
        app.main.business.init();
    },


    settingsPage: function () {
        app.main.settings.init();
    },

}
