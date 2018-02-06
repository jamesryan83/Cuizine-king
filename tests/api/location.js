"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");



describe("API - Location", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    it.skip("#get", function (done) {

    });

});