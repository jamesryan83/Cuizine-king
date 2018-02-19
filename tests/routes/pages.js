"use strict";


var testutil = require("../test-util");



describe("ROUTES - PAGES", function () {

    before(function (done) {
        this.timeout(10000);

        testutil.startDatabase(function () {
            done();
        });
    });



    // Site pages

    it("#aboutPage returns valid html", function (done) {
        testutil.testValidPage("/about", done);
    });


    it("#helpPage returns valid html", function (done) {
        testutil.testValidPage("/help", done);
    });


    it("#homePage returns valid html ", function (done) {
        testutil.testValidPage("/", done);
    });


    it("#locationPage returns valid html", function (done) {
        testutil.testValidPage("/location/Balmoral-4171", done);
    });


    it("#locationPage returns valid html with invalid location", function (done) {
        testutil.testValidPage("/location/Moon-1234", done);
    });


    it("#storePage returns valid html", function (done) {
        testutil.testValidPage("/store/1", done);
    });


    it.skip("#storePage returns valid html for invalid store", function (done) {
        testutil.testValidPage("/store/1dkx9x", done);
    });


    it("#loginPage returns valid html", function (done) {
        testutil.testValidPage("/login", done);
    });


    it("#registerPage returns valid html", function (done) {
        testutil.testValidPage("/register", done);
    });


    it("#storeApplicationPage returns valid html", function (done) {
        testutil.testValidPage("/store-application", done);
    });


    it("#resetPasswordPage returns valid html", function (done) {
        testutil.testValidPage("/reset-password?t=blahblahblahblahblahblahblahblahblah", done);
    });


    it("#resetPasswordPage returns valid html when token missing", function (done) {
        testutil.testValidPage("/reset-password", done);
    });


    it("#verifyAccountPage returns valid html", function (done) {
        testutil.testValidPage("/verify-account?t=blahblahblahblahblahblahblahblahblah", done);
    });


    it("#verifyAccountPage returns valid html when token missing", function (done) {
        testutil.testValidPage("/verify-account", done);
    });


    it("Invalid route returns valid html with 404", function (done) {
        testutil.testValidPage("/blahblah", done, 404, null, true);
    });




    // System admin pages



    it.skip("#sysadminPage create-store invalid jwt redirects to login page with 302", function () {
        // this is more of a ui test
        // there is some html loaded to make the initial request for other stuff
    });


    it("#sysadminPage create-store returns valid html", function (done) {
        testutil.testValidPage("/sysadmin/create-store", done);
    });


    it("#sysadminPage edit-store returns valid html", function (done) {
        testutil.testValidPage("/sysadmin/edit-store", done);
    });


    it("#sysadminPage database returns valid html", function (done) {
        testutil.testValidPage("/sysadmin/database", done);
    });



//    // CMS pages
//
//    it("#businessPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/business", done);
//    });
//
//
//    it("#businessPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/business", done, 200, jwt);
//        });
//    });
//
//
//    it("#dashboardPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/dashboard", done);
//    });
//
//
//    it("#dashboardPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/dashboard", done, 200, jwt);
//        });
//    });
//
//
//    it("#deliverySuburbsPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/delivery-suburbs", done);
//    });
//
//
//    it("#deliverySuburbsPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/delivery-suburbs", done, 200, jwt);
//        });
//    });
//
//
//    it("#menuPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/menu", done);
//    });
//
//
//    it("#menuPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/menu", done, 200, jwt);
//        });
//    });
//
//
//    it("#ordersPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/orders", done);
//    });
//
//
//    it("#ordersPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/orders", done, 200, jwt);
//        });
//    });
//
//
//    it("#settingsPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/settings", done);
//    });
//
//
//    it("#settingsPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/settings", done, 200, jwt);
//        });
//    });
//
//
//    it("#transactionsPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/1/transactions", done);
//    });
//
//
//    it("#transactionsPage valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/store-admin/1/transactions", done, 200, jwt);
//        });
//    });

});