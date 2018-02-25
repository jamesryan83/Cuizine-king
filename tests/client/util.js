"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var util = require("../../www/js/shared/util");
var validationRules = require("../../www/js/shared/validation-rules");





describe("CLIENT - UTIL", function () {


    it("#checkIfObject", function () {
        var result = util.checkIfObject();
        assert.equal(result, false);

        var result = util.checkIfObject(null);
        assert.equal(result, false);

        var result = util.checkIfObject(undefined);
        assert.equal(result, false);

        var result = util.checkIfObject("");
        assert.equal(result, false);

        var result = util.checkIfObject("test");
        assert.equal(result, false);

        var result = util.checkIfObject(0);
        assert.equal(result, false);

        var result = util.checkIfObject(1);
        assert.equal(result, false);

        var result = util.checkIfObject(true);
        assert.equal(result, false);

        var result = util.checkIfObject(["zing"]);
        assert.equal(result, false);

        var result = util.checkIfObject({});
        assert.equal(result, true);

        var result = util.checkIfObject({ test: "test" });
        assert.equal(result, true);
    });


    it("#checkIfString", function () {
        var result = util.checkIfString();
        assert.equal(result, false);

        var result = util.checkIfString(null);
        assert.equal(result, false);

        var result = util.checkIfString(undefined);
        assert.equal(result, false);

        var result = util.checkIfString(0);
        assert.equal(result, false);

        var result = util.checkIfString(1);
        assert.equal(result, false);

        var result = util.checkIfString(true);
        assert.equal(result, false);

        var result = util.checkIfString(["zing"]);
        assert.equal(result, false);

        var result = util.checkIfString({});
        assert.equal(result, false);

        var result = util.checkIfString({ test: "test" });
        assert.equal(result, false);

        var result = util.checkIfString("");
        assert.equal(result, true);

        var result = util.checkIfString("test");
        assert.equal(result, true);
    });


    it("#checkIfDate", function () {
        var result = util.checkIfDate();
        assert.equal(result, false);

        result = util.checkIfDate(null);
        assert.equal(result, false);

        result = util.checkIfDate(undefined);
        assert.equal(result, false);

        result = util.checkIfDate(0);
        assert.equal(result, false);

        result = util.checkIfDate(1);
        assert.equal(result, false);

        result = util.checkIfDate(true);
        assert.equal(result, false);

        result = util.checkIfDate(["zing"]);
        assert.equal(result, false);

        result = util.checkIfDate({});
        assert.equal(result, false);

        result = util.checkIfDate({ test: "test" });
        assert.equal(result, false);

        result = util.checkIfDate("");
        assert.equal(result, false);

        result = util.checkIfDate("test");
        assert.equal(result, false);

        result = util.checkIfDate(testutil.date1);
        assert.equal(result, true);
    });


    it("#checkIfPositiveInteger", function () {
        var result = util.checkIfPositiveInteger();
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(null);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(undefined);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(true);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(["zing"]);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger({});
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger({ test: "test" });
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger("");
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger("test");
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(-1);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger(0);
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger("-1");
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger("0");
        assert.equal(result, false);

        var result = util.checkIfPositiveInteger("1");
        assert.equal(result, true);

        var result = util.checkIfPositiveInteger(1);
        assert.equal(result, true);
    });


    it("#validateInputs returns error when missing inputs", function () {
        var valid = util.validateInputs();
        assert.equal(valid, false);

        var valid = util.validateInputs({});
        assert.equal(valid, false);
    });


    it("#validateInputs returns error when missing rule", function () {
        var valid = util.validateInputs({});
        assert.equal(valid, false);

        var valid = util.validateInputs({}, null);
        assert.equal(valid, false);
    });


    it("#validateInputs works", function () {
        var inputs = { email: "hey@test.com", password: "test" };
        var valid = util.validateInputs(inputs, validationRules.login);
        assert.equal(valid, true);
    });


    it("#getTodayIndex returns correct index", function () {
        var result = util.getTodayIndex(testutil.date1);
        assert.equal(result, 0);
        result = util.getTodayIndex(testutil.date2);
        assert.equal(result, 1);
        result = util.getTodayIndex(testutil.date3);
        assert.equal(result, 2);
        result = util.getTodayIndex(testutil.date4);
        assert.equal(result, 3);
        result = util.getTodayIndex(testutil.date5);
        assert.equal(result, 4);
        result = util.getTodayIndex(testutil.date6);
        assert.equal(result, 5);
        result = util.getTodayIndex(testutil.date7);
        assert.equal(result, 6);
    });


    it("#getTodayName returns correct name", function () {
        var result = util.getTodayName(testutil.date1);
        assert.equal(result, "mon");
        result = util.getTodayName(testutil.date2);
        assert.equal(result, "tue");
        result = util.getTodayName(testutil.date3);
        assert.equal(result, "wed");
        result = util.getTodayName(testutil.date4);
        assert.equal(result, "thu");
        result = util.getTodayName(testutil.date5);
        assert.equal(result, "fri");
        result = util.getTodayName(testutil.date6);
        assert.equal(result, "sat");
        result = util.getTodayName(testutil.date7);
        assert.equal(result, "sun");
    });


    it("#getTomorrowName returns correct name", function () {
        var result = util.getTomorrowName(testutil.date1);
        assert.equal(result, "tue");
        result = util.getTomorrowName(testutil.date2);
        assert.equal(result, "wed");
        result = util.getTomorrowName(testutil.date3);
        assert.equal(result, "thu");
        result = util.getTomorrowName(testutil.date4);
        assert.equal(result, "fri");
        result = util.getTomorrowName(testutil.date5);
        assert.equal(result, "sat");
        result = util.getTomorrowName(testutil.date6);
        assert.equal(result, "sun");
        result = util.getTomorrowName(testutil.date7);
        assert.equal(result, "mon");
    });


    it("#toTitleCase", function () {
        var result = util.toTitleCase();
        assert.equal(result, "");

        var result = util.toTitleCase("");
        assert.equal(result, "");

        var result = util.toTitleCase("t");
        assert.equal(result, "T");

        var result = util.toTitleCase("some test text");
        assert.equal(result, "Some Test Text");
    });



    // requires ui stuff
//    it.skip("#setupTemplateFormatters", function (done) { });
//    it.skip("#showToast", function (done) { });
//    it.skip("#showLoadingScreen", function (done) { });
//    it.skip("#hideLoadingScreen", function (done) { });
//    it.skip("#loadTemplate", function (done) { });
//    it.skip("#checkToken", function (done) { });
//    it.skip("#preloadImages", function (done) { });
//    it.skip("#uploadImage", function (done) { });
//    it.skip("#ajaxRequest", function (done) { });


});