"use strict";

var app = app || {};


// Logged out pages
// These are called from client-router
app.loggedOut = {

    initialized: false,


    init: function () {
        this.initialized = true;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        // TODO : click dialog container to close
    },


    homePage: function (routeData) {
        app.home.init(routeData);
//        $('html, body').animate({ scrollTop: 350 }, 1000);
    },


    aboutPage: function () {

    },


    helpPage: function () {

    },


    locationPage: function (routeData) {
        app.location.init(routeData);
    },


    storePage: function (routeData) {
        app.store.init(routeData);
    },


    loginPage: function (routeData) {
        app.login.init(routeData);
    },


    storeLoginPage: function (routeData) {
        app.login.init(routeData);
    },


    verifyAccountPage: function () {
        app.verifyAccount.init();
    },


    resetPasswordPage: function () {
        app.resetPassword.init();
    },


    registerPage: function (routeData) {
        app.login.init(routeData);
    },


    registerStorePage: function (routeData) {
        app.login.init(routeData);
    },


    errorPage: function () {

    },


    // TODO : move to logged-in.js when auth is working again
    // TODO : lots of security
    sysadminPage: function (routeData) {
        app.sysadmin.init(routeData);
    },

}
