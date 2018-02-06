"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var jwt = require("jsonwebtoken");
var supertest = require("supertest");
var superagent = require("superagent");
var execSync = require("child_process").execSync;

var config = require("../server/config");
var database = require("../server/database/database");

var sqlCwd = path.join(__dirname, "../", "sql", "batchfiles");



global.logSQLerrors = config.logSQLerrors; // used elsewhere
global.devMode = true;

config.mssql.database = "menuthingTest";



// General functions and stuff for testing
exports = module.exports = {

    regexValidHtml: /(\s*)<!DOCTYPE html>(\s*)<html>(\s*)<head>[\s\S]*<\/head>(\s*)<body(.*)>[\s\S]*<\/body>(\s*)<\/html>(\s*)/gmi,

    supertestUrl: "http://localhost:" + config.port,

    validationRules: require("../www/js/shared/validation-rules.js"),

    fakeUsers: require("./fixtures/fakeusers"),

    fakeStores: require("./fixtures/fakestores"),


    // empty database and connect
    startDatabase: function (callback) {
        database.runBatchFileSync("empty-test-db.bat", sqlCwd);

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
    getApiToken: function (callback, email, password, url) {
        superagent
            .post(this.supertestUrl + (url || "/api/v1/login"))
            .send({ email: (email || this.fakeUsers.website.email), password: (password || this.fakeUsers.website.password) })
            .set("accept", "json")
            .end(function (err, res) {
                if (err) throw new Error(err);

                return callback(res.body.data.jwt);
            });
    },


    // Get a users jwt
    getJwt: function (id_person, done, callback) {
        database.executeQuery("SELECT jwt from App.people WHERE id_person = " + id_person, function (err, result) {
            if (err) return done(new Error(err));

            callback(result.recordset[0].jwt);
        });
    },


    // create a jwt synchronously
    createJwtSync: function (id_person, shortExp, longExp) {
        if (!id_person) id_person = 1;

        return jwt.sign({
            sub: id_person,
            shortExp: shortExp || config.jwtExpiryShort
        }, config.secret, {
            expiresIn: longExp || config.jwtExpiryLong
        });
    },


    // test if page has valid html and other stuff
    testValidPage: function (route, done, status, jwt, isErrorPage) {
        var self = this;
        if (!status) status = 200;

        supertest(this.supertestUrl)
            .get(route)
            .set("Content-Type", "text/html")
            .set("Accept", "text/html")
            .set("authorization", "Bearer " + jwt)
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(status)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                if (!isErrorPage) {
                    assert.ok(res.text.indexOf("id=\"page-error\"") === -1);
                }

                assert(res.text.match(self.regexValidHtml), "Invalid html");
                done();
            });
    },


    // Test if a request was redirected to the login page
    testRedirectToLogin: function (route, done) {
        supertest(this.supertestUrl)
            .get(route)
            .set("Content-Type", "text/html")
            .set("Accept", "text/html")
            .expect("Content-Type", "text/html; charset=utf-8")
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
