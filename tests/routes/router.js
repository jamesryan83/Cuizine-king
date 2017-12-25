"use strict";


var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../testutil");
var router = require("../../server/other/router");
var clientRouter = require("../../www/js/shared/client-router");



describe("ROUTER", function () {

    it("#catchAll redirects to error page", function (done) {
        supertest(testutil.supertestUrl)
            .get("/fake/route")
            .expect("location", "/error")
            .expect(302, done);
    });


    it("#catchAll returns 404 json", function (done) {
        supertest(testutil.supertestUrl)
            .get("/fake/route")
            .set("Content-Type", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(404, done);
    });


    it("#validateInputs works with valid inputs", function () {

        // test using the login validation object
        var result = router.validateInputs(null, {
            email: "ding@zing.com",
            password: "blahblah"
        }, testutil.validationRules.login);

        assert.equal(result, undefined);
    });


    it.skip("#validateInputs returns message with invalid inputs", function () {

        // mock response object
        var fakeRes = {
            status: function (num) {
                this.status = num;
                return this;
            },
            send: function (message) {
                this.message = message;
                return this;
            }
        };

        var fakeReq = { xhr: false, headers: [] };

        // test using the login inputs and login validation object
        var result = router.validateInputs(fakeReq, fakeRes, {
            email: "dingzing",
            password: "b"
        }, testutil.validationRules.login);


        assert.equal(result.status, 400);
        assert.ok(typeof result.message === "string" && result.message.length > 1);
    });


    it.skip("#renderPage", function () {

    });


    it.skip("#renderErrorPage", function () {

    });


    it.skip("#sendJson", function () {

    });


    it.skip("#isRequestAjax", function () {

    });

});