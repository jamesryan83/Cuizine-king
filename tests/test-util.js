"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var supertest = require("supertest");
var superagent = require("superagent");
var execSync = require("child_process").execSync;

var config = require("../server/config");
var database = require("../server/database/database");

var sqlCwd = path.join(__dirname, "../", "sql");

var regexValidHtml = /(\s*)<!DOCTYPE html>(\s*)<html>(\s*)<head>[\s\S]*<\/head>(\s*)<body(.*)>[\s\S]*<\/body>(\s*)<\/html>(\s*)/gmi;

global.logSQLerrors = config.logSQLerrors; // used elsewhere
global.devMode = true;

config.mssql.database = "menuthingTest";



// General functions and stuff for testing
exports = module.exports = {

    supertestUrl: "http://localhost:" + config.port,

    validationRules: require("../www/js/shared/validation-rules.js"),

    fakeUser: require("../fakedata/tests/fakeuser"),

    fakeStore: require("../fakedata/tests/fakestore"),


    // empty database and connect
    startDatabase: function (withSeedData, callback) {
        if (!callback) {
            callback = withSeedData;
            withSeedData = false;
        }

        database.runBatchFileSync("empty-test-db.bat", sqlCwd);
//        if (withSeedData) database.runSqlScriptSync(sqlOtherCwd + "\\seed.sql");

        if (database.isConnected) {
            return callback();
        }

        database.once("connected", function () {
            return callback();
        });

        database.once("errorConnecting", function (err) {
            throw new Error(err);
        });

        database.once("errorPool", function (err) {
            throw new Error(err);
        });

        database.connect();
    },


    // Gets an api token for making api requests
    getApiToken: function (callback) {
        superagent
            .post(this.supertestUrl + "/api/v1/token")
            .send({ email: this.fakeUser.email, password: this.fakeUser.password })
            .set("accept", "json")
            .end(function (err, res) {
                return callback(err, res);
            });
    },


    // test if page has valid html and other stuff
    testValidPage: function (route, done, status, cookie) {
        if (!status) status = 200;

        supertest(this.supertestUrl)
            .get(route)
            .set("Content-Type", "text/html")
            .set("Accept", "text/html")
            .set("Cookie", [cookie || ''])
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(status)
            .end(function (err, res) {
            if (err) return done(new Error(err));

                assert(res.text.match(regexValidHtml), "Invalid html");
                done();
            });
    },


    // Test if a request was redirected to the login page
    testRedirectToLogin: function (route, done) {
        supertest(this.supertestUrl)
            .get(route)
            .expect("location", "/login")
            .expect(302, done);
    },


    // Returns the current sequence values
    getCurrentSequenceValues: function (callback) {
        var q = fs.readFileSync(sqlCwd + "\\generated\\_get-sequences.sql", "utf-8");

        database.executeQuery(q, function (err, result) {
            if (err) return callback(err);

            var output = [];
            for (var i = 0; i < result.recordsets.length; i++) {
                output[result.recordsets[i][0].name] =
                    result.recordsets[i][0].current_value;
            }

            return callback(null, output);
        });
    },

}