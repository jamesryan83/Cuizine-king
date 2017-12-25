"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../testutil");
var config = require("../../server/config");
var users = require("../../server/database/users");
var database = require("../../server/database/database");
var companiesApi = require("../../server/api/auth");



describe.skip("API - Companies", function () {

    before(function (done) {
        testutil.recreateAndStartDatabase(function () {
            done();
        }, true);
    });


    it.skip("#get", function (done) {

    });


    it.skip("#update", function (done) {

    });

});