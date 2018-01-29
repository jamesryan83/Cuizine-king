"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var authApi = require("../../server/api/auth");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");



describe("API - AUTH", function () {


    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    it("#login returns message for no user", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/login")
            .set("Content-Type", "application/json")
            .send({
                email: "fake@user.com",
                password: testutil.fakeUser.password })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Account not found");
                done();
            });
    });


    it("#logout returns message for no user", function (done) {
        var jwt = testutil.createJwtSync();

        supertest(testutil.supertestUrl)
            .get("/api/v1/logout")
            .set("Content-Type", "application/json")
            .set("authorization", "Bearer " + jwt)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                assert.equal(res.body.err, "Account not found");
                done();
            });
    });


    it.skip("#storeLogin returns message for no user", function (done) {

    });


    it("#createUser creates a user", function (done) {
        this.timeout(3000);

        supertest(testutil.supertestUrl)
            .post("/api/v1/register")
            .set("Content-Type", "application/json")
            .send({
                first_name: testutil.fakeUser.first_name,
                last_name: testutil.fakeUser.last_name,
                email: testutil.fakeUser.email,
                password: testutil.fakeUser.password,
                confirmPassword: testutil.fakeUser.password })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                // TODO : check if email was sent

                // check result
                assert.ok(res.body.data.jwt.length > 100);
                assert.equal(res.body.data.id_person, 1);

                var query = "SELECT id_person, jwt FROM App.people WHERE email = '" + testutil.fakeUser.email + "'";

                // check db was updated
                database.executeQuery(query, function (err, result) {
                    if (err) return done(new Error(err));

                    assert.equal(result.recordset[0].jwt, res.body.data.jwt);
                    assert.equal(result.recordset[0].id_person, 1);
                    done();
                });
            });
    });


    it("#createUser returns error message if user already exists", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/register")
            .set("Content-Type", "application/json")
            .send({
                first_name: testutil.fakeUser.first_name,
                last_name: testutil.fakeUser.last_name,
                email: testutil.fakeUser.email,
                password: testutil.fakeUser.password,
                confirmPassword: testutil.fakeUser.password })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(409)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Account already taken");
                done();
            });
    });


    it("#login works when unverified", function (done) {
        testutil.getApiToken(function (res) {

            supertest(testutil.supertestUrl)
                .post("/api/v1/login")
                .set("Content-Type", "application/json")
                .set("authorization", "Bearer " + res)
                .send({
                    email: testutil.fakeUser.email,
                    password: testutil.fakeUser.password })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.ok(res.body.data.jwt.length > 100);
                    assert.equal(res.body.data.id_person, 1);
                    done();
                });
        });
    });


    it("#forgotPassword returns message when account not verified", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/forgot-password")
            .set("Content-Type", "application/json")
            .send({ email: testutil.fakeUser.email })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                assert.equal(res.body.err, "Please verify your account");
                done();
            });
    });


    it("#verifyAccount returns message for account not found", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/verify-account")
            .set("Content-Type", "application/json")
            .send({
                email: "fake@email.com",
                password: testutil.fakeUser.password,
                verification_token: testutil.fakeUser.verification_token })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Account not found");
                done();
            });
    });


    it("#verifyAccount returns message for invalid token", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/verify-account")
            .set("Content-Type", "application/json")
            .send({
                email: testutil.fakeUser.email,
                password: testutil.fakeUser.password,
                verification_token: "11111111111111111111111111111111111111111111111111" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Invalid token");
                done();
            });
    });


    it("#verifyAccount sets is_verified to 1", function (done) {
        database.executeQuery("SELECT verification_token FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .post("/api/v1/verify-account")
                .set("Content-Type", "application/json")
                .send({
                    email: testutil.fakeUser.email,
                    password: testutil.fakeUser.password,
                    verification_token: result.recordset[0].verification_token })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.ok(!res.body.err);
                    done();
                });
        });
    });


    it("#verifyAccount returns message when account is already verified", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/verify-account")
            .set("Content-Type", "application/json")
            .send({
                email: testutil.fakeUser.email,
                password: testutil.fakeUser.password,
                verification_token: "11111111111111111111111111111111111111111111111111" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Account already verified");
                done();
            });
    });


    it("#forgotPassword returns message when account not found", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/forgot-password")
            .set("Content-Type", "application/json")
            .send({ email: "testtest@test.test" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                assert.equal(res.body.err, "Account not found");
                done();
            });
    });


    it("#forgotPassword returns message when account is found", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/forgot-password")
            .set("Content-Type", "application/json")
            .send({ email: testutil.fakeUser.email })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.ok(res.body.data.message.length > 10);
                done();
            });
    });


    it("#login returns 400 and message for invalid inputs", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/login")
            .send({ email: "", password: "" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                assert.equal(res.body.err, "Email can't be blank");
                done();
            });
    });


    it("#register returns 400 and message for invalid inputs", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/register")
            .send({ })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                assert.equal(res.body.err, "First name can't be blank");
                done();
            });
    });





    it("#resetPassword changes password in db", function (done) {

        // get reset password token from db
        dbApp.people_get_by_email({ email: testutil.fakeUser.email }, function (err, user) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .post("/api/v1/reset-password")
                .send({ email: testutil.fakeUser.email, password: "test2", confirmPassword: "test2", reset_password_token: user.reset_password_token })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    // check password was changed
                    dbApp.people_get_by_email({ email: testutil.fakeUser.email }, function (err, user2) {
                        if (err) return done(new Error(err));

                        assert.ok(user.password != user2.password);

                        done();
                    });
                });
        });
    });


});
