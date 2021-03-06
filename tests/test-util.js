"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var jwt = require("jsonwebtoken");
var supertest = require("supertest");
var superagent = require("superagent");

var config = require("../server/config");
var database = require("../server/database/database");
var dbStores = require("../server/procedures/_Store");

var sqlCwd = path.join(__dirname, "../", "sql", "batchfiles");



global.logSQLerrors = config.logSQLerrors; // used elsewhere
global.devMode = true;

config.mssql.database = "menuthingTest";



// General functions and stuff for testing
exports = module.exports = {


    date1: new Date("2018-02-19T08:00:00"), // monday
    date2: new Date("2018-02-20T08:00:00"), // tuesday
    date3: new Date("2018-02-21T08:00:00"), // wednesday
    date4: new Date("2018-02-22T08:00:00"), // thursday
    date5: new Date("2018-02-23T08:00:00"), // friday
    date6: new Date("2018-02-24T08:00:00"), // saturday
    date7: new Date("2018-02-25T08:00:00"), // sunday


    regexValidHtml: /(\s*)<!DOCTYPE html>(\s*)<html lang="en_US">(\s*)<head>[\s\S]*<\/head>(\s*)<body(.*)>[\s\S]*<\/body>(\s*)<\/html>(\s*)/gmi,

    supertestUrl: "http://localhost:" + config.port,

    validationRules: require("../www/js/shared/validation-rules.js"),

    fakeUsers: require("./fixtures/fakeusers"),
    fakeStores: require("./fixtures/fakestores"),
    fakeStoreUpdate: require("./fixtures/update-store"),


    // empty database and connect
    startDatabase: function (callback) {
        database.runBatchFileSync("test-db-empty.bat", sqlCwd);

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



    // Create a user
    createUser: function (route, data, status, jwtToken, callback) {
        supertest(this.supertestUrl)
            .post(route)
            .set("Content-Type", "application/json")
            .set("authorization", "Bearer " + jwtToken)
            .send(data)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(status)
            .end(function (err, res) {
                return callback(err, res)
        });
    },



    // Creates a store and one website, store and system user
    createAStoreAndOneOfEachUserType: function (done, callback) {
        var self = this;

        var fakeStore = JSON.parse(JSON.stringify(this.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;

        // create a store first
        dbStores.stores_create(fakeStore, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            self.getJwt(config.dbConstants.adminUsers.system, done, function (jwToken) {

                self.createUser("/api/v1/create-user", self.fakeUsers.website, 200, null, function (err2) {
                    if (err) return done(new Error(err2));

                    self.createUser("/api/v1/create-store-user", self.fakeUsers.store, 200, jwToken, function (err3) {
                        if (err) return done(new Error(err3));

                        self.createUser("/api/sysadmin/create-system-user", self.fakeUsers.system, 200, jwt, function (err4) {
                            if (err) return done(new Error(err4));

                            return callback();
                        });
                    });
                });
            });
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
        var personId = id_person || 1;

        return jwt.sign({
            sub: personId,
            shortExp: shortExp || config.jwtExpiryShort
        }, config.secret, {
            expiresIn: longExp || config.jwtExpiryLong
        });
    },


    // test if page has valid html and other stuff
    testValidPage: function (route, done, status, jwToken, isErrorPage) {
        var self = this;
        var newStatus = status || 200;

        supertest(this.supertestUrl)
            .get(route)
            .set("Content-Type", "text/html")
            .set("Accept", "text/html")
            .set("authorization", "Bearer " + jwToken)
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(newStatus)
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
