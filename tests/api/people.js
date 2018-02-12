"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");


describe("API - People", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            testutil.createAStoreAndOneOfEachUserType(done, function () {
                done();
            });
        });
    });


    it.skip("#getPerson", function (done) {

    });


});