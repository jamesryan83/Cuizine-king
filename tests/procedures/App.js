"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");


var fakeResetPasswordToken = "1234567891234567891234567891234567891234567891234567891234567891";


describe("DATABASE - APP", function () {


    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    it("#people_create_web_user creates a user", function (done) {
        dbApp.people_create_web_user(testutil.fakeUser, function (err, newPersonId) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(newPersonId, 1);
            // TODO : check data in db
            done();
        });
    });


    it("#people_create_web_user error message account already exists", function (done) {
        dbApp.people_create_web_user(testutil.fakeUser, function (err, result) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_get_by_email returns error from invalid email", function (done) {
        dbApp.people_get_by_email({ }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_email returns error from invalid email 2", function (done) {
        dbApp.people_get_by_email({ email: "123123@lkajsdf.com" }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_email returns person from email", function (done) {
        dbApp.people_get_by_email({ email: testutil.fakeUser.email }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.id_person, 1);
            done();
        });
    });


    it("#people_get_by_id returns error from invalid id", function (done) {
        dbApp.people_get_by_id({ }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_id returns error from invalid id 2", function (done) {
        dbApp.people_get_by_id({ id: 2000000 }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_id returns person from id", function (done) {
        dbApp.people_get_by_id({ id: 1 }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.id_person, 1);
            done();
        });
    });


    it("#people_get_by_jwt returns error from invalid jwt", function (done) {
        dbApp.people_get_by_jwt({ }, function (err, id_person) {
            assert.equal(err.message, "Bad token");
            done();
        });
    });


    it("#people_get_by_jwt returns error from invalid jwt 2", function (done) {
        dbApp.people_get_by_jwt({ jwt: "Account not found" }, function (err, id_person) {
            assert.equal(err.message, "Bad token");
            done();
        });
    });


    it("#people_get_by_jwt returns person from jwt", function (done) {
        dbApp.people_get_by_jwt({ jwt: testutil.fakeUser.jwt, email: testutil.fakeUser.email }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.id_person, 1);
            done();
        });
    });


    it("#people_update_reset_password_token returns message if account not verified", function (done) {
        dbApp.people_update_reset_password_token({
            email: testutil.fakeUser.email, reset_password_token: testutil.fakeUser.reset_password
        }, function (err, id_person) {
            assert.equal(err.message, "Please verify your account");
            done();
        });
    });


    it("#people_update_is_verified returns message if account not found", function (done) {
        var inputs = { email: "test@test.test", verification_token: testutil.fakeUser.verification_token };

        dbApp.people_update_is_verified(inputs, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_update_is_verified returns message if token mismatch", function (done) {
        var inputs = { email: testutil.fakeUser.email, verification_token: "fakeToken" };

        dbApp.people_update_is_verified(inputs, function (err, id_person) {
            assert.equal(err.message, "Invalid token");
            done();
        });
    });


    it("#people_update_is_verified sets verified to true", function (done) {
        var query = "SELECT verification_token FROM App.people WHERE email ='" + testutil.fakeUser.email + "'";

        database.executeQuery(query, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_update_is_verified({
                email: testutil.fakeUser.email,
                verification_token: result.recordset[0].verification_token
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                var query2 = "SELECT is_verified FROM App.people WHERE email ='" + testutil.fakeUser.email + "'";

                database.executeQuery(query2, function (err, result) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result.recordset[0].is_verified, 1);
                    done();
                });
            });
        });
    });


    it("#people_update_is_verified returns message if account already verified", function (done) {
        var query = "SELECT verification_token FROM App.people WHERE email ='" + testutil.fakeUser.email + "'";

        database.executeQuery(query, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_update_is_verified({
                email: testutil.fakeUser.email,
                verification_token: result.recordset[0].verification_token
            }, function (err, result) {

                assert.equal(err.message, "Account already verified");
                done();
            });
        });
    });


    it("#people_update_reset_password_token returns message if account not found", function (done) {
        dbApp.people_update_reset_password_token({
            email: "test@test.test", reset_password_token: testutil.fakeUser.reset_password
        }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_update_reset_password_token updates token", function (done) {
        database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(result.recordset[0].reset_password_token != fakeResetPasswordToken);

            dbApp.people_update_reset_password_token({
                email: testutil.fakeUser.email, reset_password_token: fakeResetPasswordToken
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result2) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result2.recordset[0].reset_password_token, fakeResetPasswordToken);

                    done();
                });
            });
        });
    });


    it("#people_update_password returns message if bad token", function (done) {
        dbApp.people_update_password({
            email: testutil.fakeUser.email, reset_password_token: "somekindatoken", password: "testpw"
        }, function (err, result) {
            assert.equal(err.message, "Bad token");

            done();
        });
    });


    it("#people_update_password returns message if account not found", function (done) {
        database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var existingToken = result.recordset[0].reset_password_token;
            assert.equal(existingToken, fakeResetPasswordToken);

            dbApp.people_update_password({
                email: "fake@user.com", reset_password_token: existingToken, password: "testpw"
            }, function (err, result) {
                assert.equal(err.message, "Account not found");

                done();
            });
        });
    });


    it("#people_update_password updates the password", function (done) {
        database.executeQuery("SELECT password, reset_password_token FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var newPassword = "testpw";
            var existingToken = result.recordset[0].reset_password_token;

            assert.equal(existingToken, fakeResetPasswordToken);
            assert.ok(result.recordset[0].password != newPassword);

            dbApp.people_update_password({
                email: testutil.fakeUser.email, reset_password_token: existingToken, password: newPassword
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                database.executeQuery("SELECT password FROM App.people WHERE email = '" + testutil.fakeUser.email + "'", function (err, result2) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result2.recordset[0].password, newPassword);
                    done();
                });
            });
        });
    });


});