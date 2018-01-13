"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var meApi = require("../../server/api/me");
var database = require("../../server/database/database");
var users = require("../../server/procedures/_users");



describe("API - ME", function () {

    before(true, function (done) {
        testutil.recreateAndStartDatabase(true, function () {
            done();
        });
    });


    it("#get returns error when unauthorized", function (done) {
        supertest(testutil.supertestUrl)
            .get("/api/v1/me")
            .set("Content-Type", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                assert.equal("Not Authorized", res.body.err);
                done();
            });
    });


    // TODO : do this for all api routes
    it("#get returns message when invalid jwt", function (done) {
        supertest(testutil.supertestUrl)
            .get("/api/v1/me")
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer invalidtoken")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                assert.equal("Not Authorized", res.body.err);
                done();
            });
    });


    // TODO : do this for all api routes
    it.skip("#get returns message when expired jwt", function (done) {
        // TODO : refresh tokens
        // https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
    });


    it("#get returns logged in user when valid jwt", function (done) {
        testutil.getApiToken(function (err, res) {
            if (err) return done(new Error(err));

            assert.ok(res.body.data.jwt.length > 30);

            supertest(testutil.supertestUrl)
                .get("/api/v1/me")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + res.body.data.jwt) // jwt in header
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    // check data is there
                    var data = res.body.data;
                    assert.ok(data.id_person);
                    assert.ok(data.id_pending_user == null);
                    assert.ok(data.first_name);
                    assert.ok(data.last_name);
                    assert.ok(data.email);
                    assert.ok(data.created);
                    assert.ok(data.updated);
                    assert.ok(data.jwt);
                    assert.ok(data.password);

                    done();
                });
        });

    });

    // TODO : move some of this stuff to testutil
    it("#update updates logged in user", function (done) {
        testutil.getApiToken(function (err, res) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .put("/api/v1/me")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + res.body.data.jwt)
                .send({ last_name: "testtest", image: "fakeimage.png", reset_password_token: "blah" })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.ok(res.body.data == null);

                    database.executeQuery(
                        "SELECT * FROM users WHERE email = '" +
                            testutil.fakeUser.email + "'",
                        function (err, result) {
                            if (err) return done(new Error(err));

                            assert.equal(result.recordset[0].last_name, "testtest");
                            assert.equal(result.recordset[0].image, "fakeimage.png");
                            assert.equal(result.recordset[0].reset_password_token, "blah");
                            done();
                        });
                });
        });
    });


    it("#delete deletes logged in user", function (done) {
        testutil.getApiToken(function (err, res) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .delete("/api/v1/me")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + res.body.data.jwt)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.ok(res.body.data == null);

                    database.executeQuery(
                        "SELECT * FROM users WHERE email = '" +
                            testutil.fakeUser.email + "'",
                        function (err, result) {
                            if (err) return done(new Error(err));

                            assert.ok(result.recordset.length == 0);
                            done();
                        });
                });
        });

    });

});