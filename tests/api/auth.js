"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var authApi = require("../../server/api/auth");
var database = require("../../server/database/database");
var users = require("../../server/procedures/_users");


describe("API - AUTH", function () {


    before(function (done) {
        testutil.recreateAndStartDatabase(function () {
            done();
        });
    });



    describe("unregisterd user", function () {

        it("#createRegistrationTokens creates tokens correctly", function (done) {
            authApi.createRegistrationTokens("test", function (err, tokens) {
                if (err) return done(new Error(err));

                assert.equal(tokens.password.length, 60);
                assert.equal(tokens.verification.length, 50);

                done();
            });
        });


        it("#createJwt returns 400 and message when acount not found", function (done) {
            supertest(testutil.supertestUrl)
                .post("/api/v1/token")
                .set("Content-Type", "application/json")
                .send({ email: testutil.fakeUser.email, password: testutil.fakeUser.password })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(401)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.equal(res.body.err, "Account not found");
                    done();
                });
        });


        it("#forgotPassword returns 400 and message when account not found", function (done) {
            supertest(testutil.supertestUrl)
                .post("/api/v1/forgot-password")
                .set("Content-Type", "application/json")
                .send({ email: "testtest@test.test" })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(401)
                .end(function (err, res) {
                    assert.equal(res.body.err, "Account not found");
                    done();
                });
        });


        it("#sendRegistrationEmail returns 400 and message when account not found", function (done) {
            supertest(testutil.supertestUrl)
                .post("/api/v1/registration-email")
                .send({ email: "test@test.test", first_name: "james", token: "1234567" })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(401)
                .end(function (err, res) {
                    assert.equal(res.body.err, "Account not found");
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


        it("#login returns 401 and message when account not found", function (done) {
            supertest(testutil.supertestUrl)
                .post("/api/v1/login")
                .send({ email: "nouser@test.com", password: "fake" })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(401)
                .end(function (err, res) {
                    assert.equal(res.body.err, "Account not found");
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

    });



    describe("after registration", function () {


        describe("registerd unverified user", function () {


            it("#register creates a user", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/register")
                    .send(testutil.fakeUser)
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                        users.get({ email: testutil.fakeUser.email }, function (err, user) {
                            if (err) return done(new Error(err));

                            assert.ok(user.created);
                            assert.ok(user.verification_token.length > config.secret.length);
                            assert.equal(user.password.length, 60);
                            assert.equal(user.id_pending_user, 1);

                            // change verification token to test token
                            var query =
                                "UPDATE Auth.users_pending SET verification_token = '" +
                                testutil.fakeUser.verification_token + "'";

                            database.executeQuery(query, function (err, result) {
                                if (err) return done(new Error(err));

                                done();
                            });
                        });
                    });

            });


            it("#login returns message if user isn't verified", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/login")
                    .send({ email: testutil.fakeUser.email, password: testutil.fakeUser.password })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                        assert.equal(res.body.err, "Please verify your account");
                        done();
                    });
            });


            it("#sendRegistrationEmail resends email", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/registration-email")
                    .send({ email: testutil.fakeUser.email })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200, done);
            });


            it("#forgotPassword returns message when user not verified", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/forgot-password")
                    .set("Content-Type", "application/json")
                    .send({ email: testutil.fakeUser.email })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));
                        assert.equal(res.body.err, "Please verify your account");
                        done();
                    })
            });


            it("#createJwt returns message when user not verified", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/token")
                    .set("Content-Type", "application/json")
                    .send({ email: testutil.fakeUser.email, password: testutil.fakeUser.password })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));
                        assert.equal(res.body.err, "Please verify your account");
                        done();
                    });
            });

        });


        // note : requires that previous describe() runs first
        describe("registerd verified user", function () {

            it("#logout returns 200 when not logged in", function (done) {
                supertest(testutil.supertestUrl)
                    .get("/api/v1/logout")
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200, done);
            });


            it("#verifyAccountAndLogin verifies account and logs user in", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/verify-account")
                    .send({
                        email: testutil.fakeUser.email,
                        password: testutil.fakeUser.password,
                        token: testutil.fakeUser.verification_token
                    })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                    // TODO : verify jwt
                        assert.ok(res.body.data.jwt.length > 30);

                        // check user was added to sessions table
                        database.executeQuery("SELECT * FROM sessions", function (err, result) {
                            if (err) return done(new Error(err));

                            var rows = result.recordset;

                            assert.ok(rows.length > 0)

                            var session = "";
                            var userFound = false;
                            for (var i = 0; i < rows.length; i++) {
                                session = JSON.parse(rows[i].session);

                                // check for {"passport":{"user":1}}
                                if (session.passport && session.passport.user === 1) {
                                    userFound = true;
                                    break;
                                }
                            }

                            assert.ok(userFound);
                            done();
                        });
                    });
            });


            it("#createJwt creates a jwt", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/token")
                    .set("Content-Type", "application/json")
                    .send({ email: testutil.fakeUser.email, password: testutil.fakeUser.password })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                    // TODO : verify jwt
                        assert.ok(res.body.data.jwt.length > 30);
                        done();
                    });
            });


            it("#logout logs user out", function (done) {
                supertest(testutil.supertestUrl)
                    .get("/api/v1/logout")
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200)
                    .end(function (err) {

                        // check that user is redirected on route that requires login
                        supertest(testutil.supertestUrl)
                            .get("/dashboard")
                            .expect("location", "/login")
                            .expect(302, done);
                    });
            });


            it("#register returns 409 and message when account already taken", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/register")
                    .send(testutil.fakeUser)
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(409)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                        assert.equal(res.body.err, "Account already taken");
                        done();
                    });
            });


            it("#forgotPassword returns a token", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/forgot-password")
                    .send({ email: testutil.fakeUser.email, token: "blahblahblahblahblahblahblahblahblahblahblahblah" })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                        assert.ok(res.body.data.message.length > 0);

                        // check reset password token is in db after a bit
                        setTimeout(function () {
                            users.get({ email: testutil.fakeUser.email }, function (err, user) {
                                if (err) return done(new Error(err));

                                assert.ok(user.reset_password_token.length > 30);

                                done();
                            });
                        }, 1000);
                    });
            });


            it("#resetPassword changes password in db", function (done) {

                // get reset password token from db
                users.get({ email: testutil.fakeUser.email }, function (err, user) {
                    if (err) return done(new Error(err));

                    supertest(testutil.supertestUrl)
                        .post("/api/v1/reset-password")
                        .send({ password: "test", confirmPassword: "test", token: user.reset_password_token })
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(new Error(err));

                            // check password was changed
                            users.get({ email: testutil.fakeUser.email }, function (err, user2) {
                                if (err) return done(new Error(err));

                                assert.ok(user.password != user2.password);

                                done();
                            });
                        });
                });
            });


            it("#sendRegistrationEmail returns message when user already verified", function (done) {
                supertest(testutil.supertestUrl)
                    .post("/api/v1/registration-email")
                    .set("Content-Type", "application/json")
                    .send({ email: "blah@blah.com" })
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(new Error(err));

                        assert.equal(res.body.err, "Account not found");
                        done();
                    });
            });
        });

    });

});
