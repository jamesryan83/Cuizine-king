"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../testutil");
var config = require("../../server/config");
var userApi = require("../../server/api/users");
var database = require("../../server/database/database");
var users = require("../../server/database/procedures/_users");



describe.skip("API - Users", function () {

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