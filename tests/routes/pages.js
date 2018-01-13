"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var router = require("../../server/other/router");



var cookie = null;


describe("ROUTES - PAGES", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });



    // Logged out pages

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


    it("#logoutPage redirects to home page", function (done) {
        supertest(testutil.supertestUrl)
            .get("/logout")
            .expect("location", "/login")
            .expect("Content-Type", "text/plain; charset=utf-8")
            .expect(302, done);
    });


    it("Invalid route returns valid html with 404", function (done) {
        testutil.testValidPage("/blahblah", done, 404);
    });


    // TODO : should have authentication
    it("#sysadminPage returns valid html", function (done) {
        testutil.testValidPage("/sysadmin", done);
    });




    // Logged in pages

//    it("#businessPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/33/business", done);
//    });


//    it("#mainPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/33/dashboard", done);
//    });


//    it("#deliverySuburbsPage redirects to login page when unauthorized", function (done) {
//        testutil.testRedirectToLogin("/store-admin/33/delivery-suburbs", done);
//    });


//    it("#mainPage returns valid html when authorized", function (done) {
//        supertest(testutil.supertestUrl)
//            .post("/api/v1/login")
//            .send({ email: testutil.fakeUser.email, password: "password" })
//            .end(function (err, res) {
//                if (err) return done(new Error(err));
//
//                cookie = res.headers['set-cookie'];
//                testutil.testValidPage("/dashboard", done, null, cookie);
//                // TODO : logout again here
//            });
//    });
//
//
//
//
//
//    it.skip("#accountPage returns valid html when authorized", function (done) {
//
//    });


    // TODO : other logged in pages

});