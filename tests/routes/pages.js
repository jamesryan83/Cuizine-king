"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var router = require("../../server/other/router");



var cookie = null;


describe("ROUTES - PAGES", function () {

    before(function (done) {
        this.timeout(10000);

        testutil.startDatabase(function () {
            testutil.createTestUsers(function (data) {
                done();
            });
        });
    });



    // Site pages

//    it("#aboutPage returns valid html", function (done) {
//        testutil.testValidPage("/about", done);
//    });
//
//
//    it("#helpPage returns valid html", function (done) {
//        testutil.testValidPage("/help", done);
//    });
//
//
//    it("#homePage returns valid html ", function (done) {
//        testutil.testValidPage("/", done);
//    });
//
//
//    it("#locationPage returns valid html", function (done) {
//        testutil.testValidPage("/location/Balmoral-4171", done);
//    });
//
//
//    it("#locationPage returns valid html with invalid location", function (done) {
//        testutil.testValidPage("/location/Moon-1234", done);
//    });
//
//
//    it("#storePage returns valid html", function (done) {
//        testutil.testValidPage("/store/1", done);
//    });
//
//
//    it.skip("#storePage returns valid html for invalid store", function (done) {
//        testutil.testValidPage("/store/1dkx9x", done);
//    });
//
//
//    it("#loginPage returns valid html", function (done) {
//        testutil.testValidPage("/login", done);
//    });
//
//
//    it("#registerPage returns valid html", function (done) {
//        testutil.testValidPage("/register", done);
//    });
//
//
//    it("#storeApplicationPage returns valid html", function (done) {
//        testutil.testValidPage("/store-application", done);
//    });
//
//
//    it("#resetPasswordPage returns valid html", function (done) {
//        testutil.testValidPage("/reset-password?t=blahblahblahblahblahblahblahblahblah", done);
//    });
//
//
//    it("#resetPasswordPage returns valid html when token missing", function (done) {
//        testutil.testValidPage("/reset-password", done);
//    });
//
//
//    it("#verifyAccountPage returns valid html", function (done) {
//        testutil.testValidPage("/verify-account?t=blahblahblahblahblahblahblahblahblah", done);
//    });
//
//
//    it("#verifyAccountPage returns valid html when token missing", function (done) {
//        testutil.testValidPage("/verify-account", done);
//    });
//
//
//    it("Invalid route returns valid html with 404", function (done) {
//        testutil.testValidPage("/blahblah", done, 404);
//    });




    // System admin pages

    it("#sysadminPage create-store invalid jwt redirects to login page with 302", function (done) {
//        testutil.testRedirectToLogin("/sysadmin/create-store", done);

        supertest(testutil.supertestUrl)
            .get("/sysadmin/create-store")
            .set("Content-Type", "application/json")
            .set("Accept", "text/html")
            .expect("Content-Type", "text/html; charset=utf-8")
//            .expect("location", "/login")
            .end(function (err, res) {
                console.log(err)
                console.log(res.body)
            })
    });


//    it("#sysadminPage create-store valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            supertest(testutil.supertestUrl)
//                .get("/sysadmin/create-store")
//                .set("Content-Type", "application/json")
//                .set("Accept", "text/html")
//                .set("authorization", "Bearer " + jwt)
//                .expect("Content-Type", "text/html; charset=utf-8")
//                .end(function (err, res) {
//                    assert(res.text.match(testutil.regexValidHtml), "Invalid html");
//                    done();
//                });
//        }, "james4171@hotmail.com", "password", "/admin-login");
//    });


//    it("#sysadminPage edit-store invalid jwt redirects to login page with 302", function (done) {
//        testutil.testRedirectToLogin("/sysadmin/edit-store", done);
//    });
//
//
//    it("#sysadminPage edit-store valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/sysadmin/edit-store", done, 200, jwt);
//        });
//    });
//
//
//    it("#sysadminPage database invalid jwt redirects to login page with 302", function (done) {
//        testutil.testRedirectToLogin("/sysadmin/database", done);
//    });
//
//
//    it("#sysadminPage database valid jwt returns html", function (done) {
//        testutil.getApiToken(function (jwt) {
//            testutil.testValidPage("/sysadmin/database", done, 200, jwt);
//        });
//    });
//
//
//
//
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