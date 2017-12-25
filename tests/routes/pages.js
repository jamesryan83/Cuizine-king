"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../testutil");
var router = require("../../server/other/router");



var cookie = null;


describe("PAGES", function () {


    before(function (done) {
        testutil.recreateAndStartDatabase(true, function () {
            done();
        });
    });



    // Auth pages

    it("#loginPage returns valid html", function (done) {
        testutil.testValidPage("/login", done);
    });


    it("#registerPage returns valid html", function (done) {
        testutil.testValidPage("/register", done);
    });


    it("#verifyAccountPage returns valid html", function (done) {
        testutil.testValidPage("/verify-account?t=blahblahblahblahblahblahblahblahblah", done);
    });


    it("#verifyAccountPage returns valid html when token missing", function (done) {
        testutil.testValidPage("/verify-account", done);
    });


    it("#resetPasswordPage returns valid html", function (done) {
        testutil.testValidPage("/reset-password?t=blahblahblahblahblahblahblahblahblah", done);
    });


    it("#resetPasswordPage returns valid html when token missing", function (done) {
        testutil.testValidPage("/reset-password", done);
    });


    it("#logoutPage redirects to home page", function (done) {
        supertest(testutil.supertestUrl)
            .get("/logout")
            .expect("location", "/login")
            .expect("Content-Type", "text/plain; charset=utf-8")
            .expect(302, done);
    });



    // Logged out pages

    it("#homePage returns valid html ", function (done) {
        testutil.testValidPage("/", done);
    });


    it("#aboutPage returns valid html", function (done) {
        testutil.testValidPage("/about", done);
    });


    it("#helpPage returns valid html", function (done) {
        testutil.testValidPage("/help", done);
    });


    it("#errorPage returns valid html", function (done) {
        testutil.testValidPage("/error", done, 500);
    });



    // Logged in pages

    it("#mainPage redirects to login page when unauthorized", function (done) {
        supertest(testutil.supertestUrl)
            .get("/dashboard")
            .expect("location", "/login")
            .expect(302, done);
    });


    it("#mainPage returns valid html when authorized", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/login")
            .send({ email: testutil.fakeUser.email, password: "password" })
            .end(function (err, res) {
                if (err) return done(new Error(err));

                cookie = res.headers['set-cookie'];
                testutil.testValidPage("/dashboard", done, null, cookie);
                // TODO : logout again here
            });
    });


    it("#accountPage redirects to login page when unauthorized", function (done) {
        supertest(testutil.supertestUrl)
            .get("/account")
            .expect("location", "/login")
            .expect(302, done);
    });


    it.skip("#accountPage returns valid html when authorized", function (done) {

    });


    // TODO : other logged in pages

});