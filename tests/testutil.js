"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var supertest = require("supertest");
var superagent = require("superagent");

var config = require("../server/config");
var database = require("../server/database/database");

var sqlCwd = path.join(__dirname, "sql");
var sqlOtherCwd = path.join(__dirname, "../", "sql", "other");

var regexValidHtml = /(\s*)<!DOCTYPE html>(\s*)<html>(\s*)<head>[\s\S]*<\/head>(\s*)<body(.*)>[\s\S]*<\/body>(\s*)<\/html>(\s*)/gmi;

global.logSQLerrors = config.logSQLerrors;


config.mssql.database = "menuthingTest";



// General functions and stuff for testing
exports = module.exports = {

    supertestUrl: "http://localhost:" + config.port,

    validationRules: require("../www/js/shared/validation-rules.js"),


    // a dummy user
    fakeUser: {
        postcode: "4012",
        suburb: "Nundah",

        address_line_1: "170 Buckland Road",
        address_latitude: "-27.4033",
        address_longitude: "153.0564",

        first_name: "Fake",
        last_name: "McUser",
        email: "james4165@hotmail.com",
        phone_number: "0430 710 408",
        password: "$2a$10$eHk6wrHHegXgkymdHbBKQerueh8i.RVoTxi3SR7g8MPrCKODxRTVu",
        verification_token: "PQRLFYpo9ruXekMvcUz0cvU6cOfx2sBQR6047Ly1RAcnUu6pJC",
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzNDE2NUBob3RtYWlsLmNvbSIsImlhdCI6MTUxMDA0ODMyOCwiZXhwIjoxNTEwNjUzMTI4fQ.QJoLSFiOW3Rp5d3HgNSlBYvnINgs7JmhAEHOinFQHUA",
        is_web_user: 1,
        is_system_user: 0,
        internal_notes: "james is spaz",

        id_user_doing_update: 1
    },


    // a dummy store
    fakeStore: {
        postcode: "4171",
        suburb: "Balmoral",

        address_line_1: "2C/18 Bilyana Street",
        address_latitude: "-27.4586",
        address_longitude: "153.0615",

        first_name: "james",
        last_name: "ryan",
        email: "james4165@hotmail.com",
        phone_number_user: "0430 710 408",
        password: "$2a$10$eHk6wrHHegXgkymdHbBKQerueh8i.RVoTxi3SR7g8MPrCKODxRTVu",
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzNDE2NUBob3RtYWlsLmNvbSIsImlhdCI6MTUxMDA0ODMyOCwiZXhwIjoxNTEwNjUzMTI4fQ.QJoLSFiOW3Rp5d3HgNSlBYvnINgs7JmhAEHOinFQHUA",
        internal_notes_user: null,

        logo: "http://via.placeholder.com/200x200",
        name: "test store",
        description: "this is the test store",
        phone_number_store: "0430 710 408",
        website: "https://reddit.com",
        facebook: null,
        twitter: null,
        abn: "123 123 123",
        internal_notes_store: "james is retard",
        id_user_doing_update: 1
    },


    // empty database and connect
    startDatabase: function (withSeedData, callback) {
        if (!callback) {
            callback = withSeedData;
            withSeedData = false;
        }

        database.runSqlScriptSync(sqlCwd + "\\_recreate.sql");
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


    // Returns the current sequence values
    getCurrentSequenceValues: function (callback) {
        var q = fs.readFileSync(sqlCwd + "\\_get-sequences.sql", "utf-8");

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
