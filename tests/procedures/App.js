"use strict";

var assert = require("assert");


var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");
var dbApp = require("../../server/procedures/_App");
var dbStores = require("../../server/procedures/_Store");


var fakeResetPasswordToken = "1234567891234567891234567891234567891234567891234567891234567891";

var userWebsite = JSON.parse(JSON.stringify(testutil.fakeUsers.website));
var userStore = JSON.parse(JSON.stringify(testutil.fakeUsers.store));
var userSystem = JSON.parse(JSON.stringify(testutil.fakeUsers.system));
var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));

userWebsite.id_user_doing_update = config.dbConstants.adminUsers.website;
userStore.id_user_doing_update = config.dbConstants.adminUsers.system;
userSystem.id_user_doing_update = config.dbConstants.adminUsers.system;
fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;


describe("PROCEDURES - APP", function () {


    before(function (done) {
        this.timeout(10000);

        testutil.startDatabase(function () {
            done();
        });
    });




    // -------- Create users --------

    it("#people_create_web_user creates a website user", function (done) {
        dbApp.people_create_web_user(userWebsite, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(outputs.newPersonId > 0);

            database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err, result) {
                var person = result.recordset[0];
                assert.equal(person.id_person, outputs.newPersonId);
                assert.equal(person.is_web_user, true);
                assert.equal(person.is_store_user, false);
                assert.equal(person.is_system_user, false);
                assert.equal(person.first_name, userWebsite.first_name);
                assert.equal(person.last_name, userWebsite.last_name);
                assert.equal(person.email, userWebsite.email);
                assert.equal(person.password, userWebsite.password);
                assert.equal(person.jwt, null);
                assert.equal(person.is_verified, false);
                assert.equal(person.verification_token, userWebsite.verification_token);
                assert.equal(person.is_deleted, false);
                done();
            });
        });
    });


    it("#people_create_web_user error message account already exists", function (done) {
        dbApp.people_create_web_user(userWebsite, function (err, result) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_store_user returns an error for store not found", function (done) {
        dbApp.people_create_store_user(userStore, function (err, result) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#people_create_store_user creates a store user", function (done) {
        dbStores.stores_create(fakeStore, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_create_store_user(userStore, function (err, outputs) {
                if (err) return done(new Error(JSON.stringify(err)));

                database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err, result) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    var person = result.recordset[0];
                    assert.equal(person.id_person, outputs.newPersonId);
                    assert.equal(person.is_web_user, true);
                    assert.equal(person.is_store_user, true);
                    assert.equal(person.is_system_user, false);
                    assert.equal(person.first_name, userStore.first_name);
                    assert.equal(person.last_name, userStore.last_name);
                    assert.equal(person.email, userStore.email);
                    assert.equal(person.password, userStore.password);
                    assert.equal(person.jwt, null);
                    assert.equal(person.is_verified, false);
                    assert.equal(person.verification_token, userStore.verification_token);
                    assert.equal(person.is_deleted, false);
                    done();
                });
            });
        });
    });


    it("#people_create_store_user error message account already exists", function (done) {
        dbApp.people_create_store_user(userStore, function (err, result) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_store_user returns unauthorized when not a store user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userStore));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.website;

        dbApp.people_create_store_user(tempUser, function (err, result) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_store_user returns unauthorized when not a member of the store", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userStore));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.store;

        dbApp.people_create_store_user(tempUser, function (err, result) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_system_user creates a system user", function (done) {
        dbApp.people_create_system_user(userSystem, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                var person = result.recordset[0];
                assert.equal(person.id_person, outputs.newPersonId);
                assert.equal(person.is_web_user, true);
                assert.equal(person.is_store_user, true);
                assert.equal(person.is_system_user, true);
                assert.equal(person.email, userSystem.email);
                assert.equal(person.password, userSystem.password);
                assert.equal(person.jwt, null);
                assert.equal(person.verification_token, userSystem.verification_token);
                assert.equal(person.is_verified, false);
                assert.equal(person.is_deleted, false);
                done();
            });
        });
    });


    it("#people_create_system_user error message account already exists", function (done) {
        dbApp.people_create_system_user(userSystem, function (err, id_person) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_system_user returns unauthorized when a website user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userSystem));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.website;

        dbApp.people_create_system_user(tempUser, function (err, result) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_system_user returns unauthorized when a store user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userSystem));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.store;

        dbApp.people_create_system_user(tempUser, function (err, result) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });




    // -------- Get users --------

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
        dbApp.people_get_by_email({ email: userWebsite.email }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.email, userWebsite.email);
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
        dbApp.people_get_by_id({ id: userWebsite.id_person }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.email, userWebsite.email);
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
        var jwt = testutil.createJwtSync(userWebsite.id_person);
        database.executeQuery("UPDATE App.people SET jwt = '" + jwt +
                              "' WHERE id_person = " + userWebsite.id_person, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_get_by_jwt({ jwt: jwt, id_person: userWebsite.id_person }, function (err, person) {
                if (err) return done(new Error(JSON.stringify(err)));

                assert.equal(person.email, userWebsite.email);
                done();
            });

        });
    });





    // -------- Update tokens --------

    it("#people_update_reset_password_token returns message if account not verified", function (done) {
        dbApp.people_update_reset_password_token({
            email: userWebsite.email, reset_password_token: userWebsite.reset_password
        }, function (err, id_person) {
            assert.equal(err.message, "Please verify your account");
            done();
        });
    });


    it("#people_update_is_verified returns message if account not found", function (done) {
        var inputs = { email: "test@test.test", verification_token: userWebsite.verification_token };

        dbApp.people_update_is_verified(inputs, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_update_is_verified returns message if token mismatch", function (done) {
        var inputs = { email: userWebsite.email, verification_token: "fakeToken" };

        dbApp.people_update_is_verified(inputs, function (err, id_person) {
            assert.equal(err.message, "Invalid token");
            done();
        });
    });


    it("#people_update_is_verified sets verified to true", function (done) {
        var query = "SELECT verification_token FROM App.people WHERE email ='" + userWebsite.email + "'";

        database.executeQuery(query, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_update_is_verified({
                email: userWebsite.email,
                verification_token: result.recordset[0].verification_token
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                var query2 = "SELECT is_verified FROM App.people WHERE email ='" + userWebsite.email + "'";

                database.executeQuery(query2, function (err, result) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result.recordset[0].is_verified, 1);
                    done();
                });
            });
        });
    });


    it("#people_update_is_verified returns message if account already verified", function (done) {
        var query = "SELECT verification_token FROM App.people WHERE email ='" + userWebsite.email + "'";

        database.executeQuery(query, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_update_is_verified({
                email: userWebsite.email,
                verification_token: result.recordset[0].verification_token
            }, function (err, result) {

                assert.equal(err.message, "Account already verified");
                done();
            });
        });
    });


    it("#people_update_reset_password_token returns message if account not found", function (done) {
        dbApp.people_update_reset_password_token({
            email: "test@test.test", reset_password_token: userWebsite.reset_password
        }, function (err, id_person) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_update_reset_password_token updates token", function (done) {
        database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(result.recordset[0].reset_password_token != fakeResetPasswordToken);

            dbApp.people_update_reset_password_token({
                email: userWebsite.email, reset_password_token: fakeResetPasswordToken
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result2) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result2.recordset[0].reset_password_token, fakeResetPasswordToken);

                    done();
                });
            });
        });
    });




    // -------- Update password --------

    it("#people_update_password returns message if bad token", function (done) {
        dbApp.people_update_password({
            email: userWebsite.email, reset_password_token: "somekindatoken", password: "testpw"
        }, function (err, result) {
            assert.equal(err.message, "Bad token");

            done();
        });
    });


    it("#people_update_password returns message if account not found", function (done) {
        database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result) {
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
        database.executeQuery("SELECT password, reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var newPassword = "testpw";
            var existingToken = result.recordset[0].reset_password_token;

            assert.equal(existingToken, fakeResetPasswordToken);
            assert.ok(result.recordset[0].password != newPassword);

            dbApp.people_update_password({
                email: userWebsite.email, reset_password_token: existingToken, password: newPassword
            }, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                database.executeQuery("SELECT password FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result2) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result2.recordset[0].password, newPassword);
                    done();
                });
            });
        });
    });


});