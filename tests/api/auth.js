"use strict";

var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var authApi = require("../../server/api/auth");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");
var dbStores = require("../../server/procedures/_Store");


describe("API - AUTH", function () {


    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });







    // -------------------- Create website user --------------------


    it("#websiteCreateUser creates a website user", function (done) {
        testutil.createUser("/api/v1/create-user", testutil.fakeUsers.website, 200, null, function (err, res) {
            if (err) return done(new Error(err));

            // check result
            assert.ok(res.body.data.jwt.length > 100);
            assert.ok(res.body.data.id_person > 0);

            // get new person from db
            database.executeQuery("SELECT * FROM App.people WHERE email = '" + testutil.fakeUsers.website.email + "'", function (err, result) {
                if (err) return done(new Error(err));

                var person = result.recordset[0];
                assert.equal(person.is_web_user, true);
                assert.equal(person.is_store_user, false);
                assert.equal(person.is_system_user, false);
                done();
            });
        });
    });


    it("#createUser returns error message if user already exists", function (done) {
        testutil.createUser("/api/v1/create-user", testutil.fakeUsers.website, 409, null, function (err, res) {
            if (err) return done(new Error(err));
            assert.equal(res.body.err, "Account already taken");
            done();
        });
    });





    // -------------------- Create store user --------------------


    it("#storeCreateUser fails without jwt", function (done) {
        testutil.createUser("/api/v1/create-store-user", testutil.fakeUsers.store, 401, null, function (err, res) {
            if (err) return done(new Error(err));
            assert.equal(res.body.err, "Not Authorized");
            done();
        });
    });


    it("#storeCreateUser fails with invalid jwt", function (done) {
        testutil.createUser("/api/v1/create-store-user", testutil.fakeUsers.store, 401, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MDcsImV4cCI6MTU0OTI5OTIwN30.CjvcjnfZgybk4kTo8LE8WfpDKE3o_nWprxuTmnXUzzz", function (err, res) {
            if (err) return done(new Error(err));
            assert.equal(res.body.err, "Not Authorized");
            done();
        });
    });


    // TODO : this is more testing the auth system, maybe move elsewhere
    it("#storeCreateUser fails with another users jwt", function (done) {
        testutil.getJwt(config.dbConstants.adminUsers.website, done, function (jwt) {
            testutil.createUser("/api/v1/create-store-user", testutil.fakeUsers.store, 401, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
        });
    });


    it("#storeCreateUser creates a store user", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;

        // create a store first
        dbStores.stores_create(fakeStore, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(outputs.newStoreId > 0);
            assert.ok(outputs.newPersonId > 0);

            var newUserJwt = testutil.createJwtSync(outputs.newPersonId);

            var query = "UPDATE App.people SET jwt = '" + newUserJwt + "' WHERE id_person = " + outputs.newPersonId;

            // update users jwt
            database.executeQuery(query, function (err) {
                if (err) return done(new Error(err));

                // create a store user using the jwt of the user just added to the db
                testutil.createUser("/api/v1/create-store-user", testutil.fakeUsers.store, 200, newUserJwt, function (err, res) {
                    if (err) return done(new Error(err));

                    var newPersonId2 = res.body.data.id_person;

                    assert.ok(res.body.data.jwt.length > 100);
                    assert.equal(newPersonId2, outputs.newPersonId + 1);

                    // get person created from creating the store
                    database.executeQuery("SELECT * FROM App.people WHERE email = '" + testutil.fakeUsers.store.email + "'", function (err, result) {
                        if (err) return done(new Error(err));

                        var person = result.recordset[0];
                        assert.equal(person.is_web_user, true);
                        assert.equal(person.is_store_user, true);
                        assert.equal(person.is_system_user, false);

                        // Check stores_people was updated correctly
                        database.executeQuery("SELECT * FROM Store.stores_people WHERE id_store = " + outputs.newStoreId, function (err, result2) {
                            if (err) return done(new Error(err));

                            var person1 = result2.recordset[0];
                            var person2 = result2.recordset[1];

                            assert.equal(person1.updated_by, config.dbConstants.adminUsers.system);
                            assert.equal(person2.updated_by, outputs.newPersonId);
                            assert.equal(person1.id_person, outputs.newPersonId);
                            assert.equal(person2.id_person, newPersonId2);

                            done();
                        });
                    });
                });
            });
        });
    });


    it("#storeCreateUser returns error message if user already exists", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;

        testutil.getJwt(config.dbConstants.adminUsers.system, done, function (jwt) {
            testutil.createUser("/api/v1/create-store-user", testutil.fakeUsers.store, 409, jwt, function (err, res) {
                if (err) return done(new Error(err));
                assert.equal(res.body.err, "Account already taken");
                done();
            });
        });
    });





    // -------------------- Create system user --------------------


    it("#systemCreateUser fails without jwt", function (done) {
        testutil.createUser("/api/sysadmin/create-system-user", testutil.fakeUsers.system, 401, null, function (err, res) {
            if (err) return done(new Error(err));
            assert.equal(res.body.err, "Not Authorized");
            done();
        });
    });


    it("#systemCreateUser fails with invalid jwt", function (done) {
        testutil.createUser("/api/sysadmin/create-system-user", testutil.fakeUsers.system, 401, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwic2hvcnRFeHAiOiIzMDAwMDAiLCJpYXQiOjE1MTc3NDE2MjEsImV4cCI6MTU0OTI5OTIyMX0.gNpzQhDhwlPI6GpVXN9JfVtelK0_X-Sj16aRvTOjzzz", function (err, res) {
            if (err) return done(new Error(err));
            assert.equal(res.body.err, "Not Authorized");
            done();
        });
    });


    // TODO : this is more testing the auth system, maybe move elsewhere
    it("#systemCreateUser fails with another users jwt", function (done) {
        testutil.getJwt(config.dbConstants.adminUsers.website, done, function (jwt) {
            testutil.createUser("/api/sysadmin/create-system-user", testutil.fakeUsers.system, 401, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
        });
    });


    it("#systemCreateUser creates a system user", function (done) {
        testutil.getJwt(config.dbConstants.adminUsers.system, done, function (jwt) {
            testutil.createUser("/api/sysadmin/create-system-user", testutil.fakeUsers.system, 200, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.ok(res.body.data.jwt.length > 100);
                assert.ok(res.body.data.id_person > 0);

                // get new person from db
                database.executeQuery("SELECT * FROM App.people WHERE id_person = " + res.body.data.id_person, function (err, result2) {
                    if (err) return done(new Error(err));

                    var person = result2.recordset[0];
                    assert.equal(person.is_web_user, true);
                    assert.equal(person.is_store_user, true);
                    assert.equal(person.is_system_user, true);
                    done();
                });
            });
        });
    });


    it("#systemCreateUser returns error message if user already exists", function (done) {
        testutil.getJwt(config.dbConstants.adminUsers.system, done, function (jwt) {
            testutil.createUser("/api/sysadmin/create-system-user", testutil.fakeUsers.system, 409, jwt, function (err, res) {
                if (err) return done(new Error(err));
                assert.equal(res.body.err, "Account already taken");
                done();
            });
        });
    });







    //  -------------------- Login --------------------

    function testLoginAccountNotFound (route, done) {
        supertest(testutil.supertestUrl)
            .post(route)
            .set("Content-Type", "application/json")
            .send({
                email: "fake@user.com",
                password: testutil.fakeUsers.website.password
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Account not found");
                done();
            });
    }


    it("#websiteLogin returns message for no user", function (done) {
        testLoginAccountNotFound("/api/v1/login", done);
    });


    it("#storeLogin returns message for no user", function (done) {
        testLoginAccountNotFound("/api/v1/store-login", done);
    });


    it("#systemLogin returns message for no user", function (done) {
        testLoginAccountNotFound("/api/v1/admin-login", done);
    });






    it("#logout returns message for no user", function (done) {
        var jwt = testutil.createJwtSync(123123123);

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


    it("#login works when unverified", function (done) {
        testutil.getApiToken(function (res) {

            supertest(testutil.supertestUrl)
                .post("/api/v1/login")
                .set("Content-Type", "application/json")
                .set("authorization", "Bearer " + res)
                .send({
                    email: testutil.fakeUsers.website.email,
                    password: testutil.fakeUsers.website.password })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    assert.ok(res.body.data.jwt.length > 100);
                    done();
                });
        });
    });







    //  -------------------- Forgot password, verify account and reset password --------------------


    it("#forgotPassword returns message when account not verified", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/forgot-password")
            .set("Content-Type", "application/json")
            .send({ email: testutil.fakeUsers.website.email })
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
                password: testutil.fakeUsers.website.password,
                verification_token: testutil.fakeUsers.website.verification_token })
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
                email: testutil.fakeUsers.website.email,
                password: testutil.fakeUsers.website.password,
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
        database.executeQuery("SELECT verification_token FROM App.people WHERE email = '" + testutil.fakeUsers.website.email + "'", function (err, result) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .post("/api/v1/verify-account")
                .set("Content-Type", "application/json")
                .send({
                    email: testutil.fakeUsers.website.email,
                    password: testutil.fakeUsers.website.password,
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
                email: testutil.fakeUsers.website.email,
                password: testutil.fakeUsers.website.password,
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
            .send({ email: testutil.fakeUsers.website.email })
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
            .post("/api/v1/create-user")
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
        dbApp.people_get_by_email({ email: testutil.fakeUsers.website.email }, function (err, user) {
            if (err) return done(new Error(err));

            supertest(testutil.supertestUrl)
                .post("/api/v1/reset-password")
                .send({ email: testutil.fakeUsers.website.email, password: "test2", confirmPassword: "test2", reset_password_token: user.reset_password_token })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(new Error(err));

                    // check password was changed
                    dbApp.people_get_by_email({ email: testutil.fakeUsers.website.email }, function (err, user2) {
                        if (err) return done(new Error(err));

                        assert.ok(user.password != user2.password);

                        done();
                    });
                });
        });
    });










});
