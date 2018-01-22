"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var authApi = require("../../server/api/auth");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");



describe("JWT", function () {


    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            testutil.createTestUsers(function () {
                done();
            });
        });
    });



    // Stored procedure tests


    it("#people_get_by_jwt returns message for wrong email", function (done) {
        testutil.getApiToken(function (jwt) {

            dbApp.people_get_by_jwt({ email: "james4444@hotmail.com", jwt: jwt }, function (err, person) {
                assert.equal(err.message, "Account not found");
                done();
            });
        });
    });


    it("#people_get_by_jwt returns message for null jwt", function (done) {
        dbApp.people_get_by_jwt({ email: testutil.fakeUser.email, jwt: null }, function (err, person) {
            assert.equal(err.message, "Bad token");
            assert.equal(person, null);
            done();
        });
    });


    it("#people_get_by_jwt returns message for invalid jwt", function (done) {
        dbApp.people_get_by_jwt({ email: testutil.fakeUser.email, jwt: "asdfasdfasdfasdfasdfasdfasdfasdf" }, function (err, person) {
            assert.equal(err.message, "Invalid token");
            assert.equal(person, null);
            done();
        });
    });


    it("#people_get_by_jwt returns message for correct jwt", function (done) {
        testutil.getApiToken(function (jwt) {

            dbApp.people_get_by_jwt({ email: testutil.fakeUser.email, jwt: jwt }, function (err, person) {
                if (err) return done(new Error(JSON.stringify(err)));

                assert.equal(person.id_person, 1);
                assert.equal(person.first_name, testutil.fakeUser.first_name);
                assert.equal(person.email, testutil.fakeUser.email);
                assert.equal(person.jwt, jwt);

                done();
            });
        });
    });


    it("#people_update_jwt updates the jwt", function (done) {
        testutil.getApiToken(function (jwt) {

            dbApp.people_update_jwt({ email: testutil.fakeUser.email, jwt: testutil.fakeUser.jwt }, function (err, id_person) {
                if (err) return done(new Error(JSON.stringify(err)));

                assert.equal(id_person, 1);
                done();
            });
        });
    });






    // Api tests

    it("#createJwt returns error for too no jwt", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/check-token")
            .set("Content-Type", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
    });



    it("#checkJwt returns error for too short jwt", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/check-token")
            .set("Content-Type", "application/json")
            .set("authorization", "Bearer z")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
    });


    it("#checkJwt returns error for invalid jwt", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/check-token")
            .set("Content-Type", "application/json")
            .set("authorization", "Bearer 123123123123123123123123123123123123123123123123123")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
    });


    it("#checkJwt returns id_person and same jwt when time < short expiry", function (done) {
        testutil.getApiToken(function (jwt) {

            supertest(testutil.supertestUrl)
                .post("/api/v1/check-token")
                .set("Content-Type", "application/json")
                .set("authorization", "Bearer " + jwt)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.equal(res.body.data.id_person, 1);
                    assert.ok(res.body.data.jwt.length > 30);
                    assert.ok(res.body.data.jwt == jwt);
                    done();
                });
        });
    });


    it.skip("#checkJwt returns id_person and diferent jwt when time > short expiry", function (done) {

    });


    it.skip("#checkJwt returns error message when token is expired", function (done) {

    });


    it("#logout invalidates jwt when unverified", function (done) {
        testutil.getApiToken(function (jwt) {

            supertest(testutil.supertestUrl)
                .get("/api/v1/logout")
                .set("Content-Type", "application/json")
                .set("authorization", "Bearer " + jwt)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    supertest(testutil.supertestUrl)
                        .post("/api/v1/check-token")
                        .set("Content-Type", "application/json")
                        .set("authorization", "Bearer " + jwt)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .expect(401)
                        .end(function (err, res) {
                            if (err) return done(new Error(err));

                            assert.equal(res.body.err, "Invalid token");
                            done();
                        });
                });
        });
    });

});