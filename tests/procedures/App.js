"use strict";

var assert = require("assert");
var bcrypt = require("bcryptjs");

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




    // -------- Addresses --------

    function getAddressData () {
        return {
            postcode: "4171",
            suburb: "Balmoral",
            street_address: "test address",
            id_user_doing_update: config.dbConstants.adminUsers.system
        }
    }


    it("#addresses_create_or_update error message for invalid postcode", function (done) {
        var testdata = getAddressData();
        testdata.postcode = "9999";

        dbApp.addresses_create_or_update(testdata, function (err) {
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#addresses_create_or_update error message for invalid suburb", function (done) {
        var testdata = getAddressData();
        testdata.postcode = "BlahBlahBlah";

        dbApp.addresses_create_or_update(testdata, function (err) {
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#addresses_create_or_update creates an address", function (done) {
        var testdata = getAddressData();

        dbApp.addresses_create_or_update(testdata, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            var query =
                "SELECT * FROM App.addresses AS a " +
                "JOIN App.postcodes ON a.id_postcode = App.postcodes.id_postcode " +
                "WHERE id_address = " + outputs.newAddressId;

            database.executeQuery(query, function (err2, result) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                var address = result.recordset[0];
                assert.equal(address.street_address, testdata.street_address);
                assert.equal(address.postcode, testdata.postcode);
                assert.equal(address.suburb, testdata.suburb);
                assert.equal(address.state, "QLD");

                done();
            });
        });
    });


    it("#addresses_create_or_update updates an address", function (done) {
        var testdata = getAddressData();
        testdata.id_address = 2;

        dbApp.addresses_create_or_update(testdata, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            var query =
                "SELECT * FROM App.addresses AS a " +
                "JOIN App.postcodes ON a.id_postcode = App.postcodes.id_postcode " +
                "WHERE id_address = " + outputs.newAddressId;

            database.executeQuery(query, function (err2, result) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                var address = result.recordset[0];
                assert.equal(address.street_address, testdata.street_address);
                assert.equal(address.postcode, testdata.postcode);
                assert.equal(address.suburb, testdata.suburb);
                assert.equal(address.state, "QLD");

                done();
            });
        });
    });





    // -------- Create users --------

    it("#people_create_web_user creates a website user", function (done) {
        dbApp.people_create_web_user(userWebsite, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(outputs.newPersonId > 0);

            database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err2, result) {
                if (err2) return done(new Error(JSON.stringify(err2)));

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
        dbApp.people_create_web_user(userWebsite, function (err) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_store_user returns an error for store not found", function (done) {
        dbApp.people_create_store_user(userStore, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#people_create_store_user creates a store user", function (done) {
        var tempFakeStore = JSON.parse(JSON.stringify(fakeStore));
        tempFakeStore.password = bcrypt.hashSync(fakeStore.password, 10);

        dbStores.stores_create(tempFakeStore, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_create_store_user(userStore, function (err2, outputs) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err3, result) {
                    if (err3) return done(new Error(JSON.stringify(err3)));

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
        dbApp.people_create_store_user(userStore, function (err) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_store_user returns unauthorized when not a store user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userStore));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.website;

        dbApp.people_create_store_user(tempUser, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_store_user returns unauthorized when not a member of the store", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userStore));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.store;

        dbApp.people_create_store_user(tempUser, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_system_user creates a system user", function (done) {
        dbApp.people_create_system_user(userSystem, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            database.executeQuery("SELECT * FROM App.people WHERE id_person = " + outputs.newPersonId, function (err2, result) {
                if (err2) return done(new Error(JSON.stringify(err2)));

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
        dbApp.people_create_system_user(userSystem, function (err) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


    it("#people_create_system_user returns unauthorized when a website user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userSystem));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.website;

        dbApp.people_create_system_user(tempUser, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#people_create_system_user returns unauthorized when a store user", function (done) {
        var tempUser = JSON.parse(JSON.stringify(userSystem));
        tempUser.id_user_doing_update = config.dbConstants.adminUsers.store;

        dbApp.people_create_system_user(tempUser, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });




    // -------- Get users --------

    it("#people_get_by_email returns error from invalid email", function (done) {
        dbApp.people_get_by_email({ }, function (err) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_email returns error from invalid email 2", function (done) {
        dbApp.people_get_by_email({ email: "123123@lkajsdf.com" }, function (err) {
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
        dbApp.people_get_by_id({ }, function (err) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_id returns error from invalid id 2", function (done) {
        dbApp.people_get_by_id({ id_person: 2000000 }, function (err) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_get_by_id returns person from id", function (done) {
        dbApp.people_get_by_id({ id_person: userWebsite.id_person }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(person.email, userWebsite.email);
            done();
        });
    });


    it("#people_get_by_id returns store user with store id", function (done) {
        dbApp.people_get_by_id({ id_person: userStore.id_person }, function (err, person) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(person.id_store > 0);
            assert.equal(person.id_store, userStore.id_store);
            done();
        });
    });


    it("#people_get_by_jwt returns error from invalid jwt", function (done) {
        dbApp.people_get_by_jwt({ }, function (err) {
            assert.equal(err.message, "Bad token");
            done();
        });
    });


    it("#people_get_by_jwt returns error from invalid jwt 2", function (done) {
        dbApp.people_get_by_jwt({ jwt: "Account not found" }, function (err) {
            assert.equal(err.message, "Bad token");
            done();
        });
    });


    it("#people_get_by_jwt returns person from jwt", function (done) {
        var jwt = testutil.createJwtSync(userWebsite.id_person);
        database.executeQuery("UPDATE App.people SET jwt = '" + jwt +
                              "' WHERE id_person = " + userWebsite.id_person, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            dbApp.people_get_by_jwt({ jwt: jwt, id_person: userWebsite.id_person }, function (err2, person) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                assert.equal(person.email, userWebsite.email);
                done();
            });

        });
    });





    // -------- Update tokens --------

    it("#people_update_reset_password_token returns message if account not verified", function (done) {
        dbApp.people_update_reset_password_token({
            email: userWebsite.email, reset_password_token: userWebsite.reset_password
        }, function (err) {
            assert.equal(err.message, "Please verify your account");
            done();
        });
    });


    it("#people_update_is_verified returns message if account not found", function (done) {
        var inputs = { email: "test@test.test", verification_token: userWebsite.verification_token };

        dbApp.people_update_is_verified(inputs, function (err) {
            assert.equal(err.message, "Account not found");
            done();
        });
    });


    it("#people_update_is_verified returns message if token mismatch", function (done) {
        var inputs = { email: userWebsite.email, verification_token: "fakeToken" };

        dbApp.people_update_is_verified(inputs, function (err) {
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
            }, function (err2) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                var query2 = "SELECT is_verified FROM App.people WHERE email ='" + userWebsite.email + "'";

                database.executeQuery(query2, function (err3, result2) {
                    if (err3) return done(new Error(JSON.stringify(err3)));

                    assert.equal(result2.recordset[0].is_verified, 1);
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
            }, function (err2) {
                assert.equal(err2.message, "Account already verified");
                done();
            });
        });
    });


    it("#people_update_reset_password_token returns message if account not found", function (done) {
        dbApp.people_update_reset_password_token({
            email: "test@test.test", reset_password_token: userWebsite.reset_password
        }, function (err) {
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
            }, function (err2) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                database.executeQuery("SELECT reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err3, result2) {
                    if (err3) return done(new Error(JSON.stringify(err3)));

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
        }, function (err) {
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
            }, function (err2) {
                assert.equal(err2.message, "Account not found");

                done();
            });
        });
    });


    it("#people_update_password updates the password", function (done) {
        database.executeQuery("SELECT password, reset_password_token FROM App.people WHERE email = '" + userWebsite.email + "'", function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var newPassword = bcrypt.hashSync("testpw", 10);
            var existingToken = result.recordset[0].reset_password_token;

            assert.equal(existingToken, fakeResetPasswordToken);
            assert.ok(result.recordset[0].password != newPassword);

            dbApp.people_update_password({
                email: userWebsite.email, reset_password_token: existingToken, password: newPassword
            }, function (err2) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                database.executeQuery("SELECT password FROM App.people WHERE email = '" + userWebsite.email + "'", function (err3, result2) {
                    if (err3) return done(new Error(JSON.stringify(err3)));

                    assert.equal(result2.recordset[0].password, newPassword);
                    done();
                });
            });
        });
    });




    // -------- Delete users --------

    it("#people_delete returns error when trying to delete protected account", function (done) {
        var id_person = config.dbConstants.adminUsers.system;

        database.executeQuery("SELECT jwt FROM App.people WHERE id_person = " + id_person, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var jwt = result.recordset[0].jwt;

            dbApp.people_delete({ id_person: id_person, jwt: jwt }, function (err2) {
                assert.equal(err2.message, "Protected account");
                done();
            });
        });
    });


    it("#people_delete returns account not found for wrong id_person", function (done) {
        database.executeQuery("SELECT jwt FROM App.people WHERE id_person = " + 5, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var jwt = result.recordset[0].jwt;

            dbApp.people_delete({ id_person: 200000, jwt: jwt }, function (err2) {
                assert.equal(err2.message, "Account not found");
                done();
            });
        });
    });


    it("#people_delete returns invalid token message for wrong jwt", function (done) {
        testutil.getApiToken(function (jwt) { // create a token first
            if (!jwt) return done(new Error("jwt missing"));

            dbApp.people_delete({ id_person: 5, jwt: "123123123123123123123123123123123123123123123123123" }, function (err) {
                assert.equal(err.message, "Invalid token");
                done();
            });
        }, testutil.fakeStores.email_user, testutil.fakeStores.password);
    });


    it("#people_delete returns message for deleting store owner", function (done) {
        testutil.getApiToken(function (jwt) {
            if (!jwt) return done(new Error("jwt missing"));

            dbApp.people_delete({ id_person: 5, jwt: jwt }, function (err) {
                assert.equal(err.message, "Store owners need to contact support to have their account deleted");
                done();
            });
        }, testutil.fakeStores.email_user, testutil.fakeStores.password);
    });


    function deleteUser (id_person, done) {
        database.executeQuery("SELECT email, jwt FROM App.people WHERE id_person = " + id_person, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            var jwt = result.recordset[0].jwt;
            var email = result.recordset[0].email;

            dbApp.people_delete({ id_person: id_person, jwt: jwt }, function (err2) {
                if (err2) return done(new Error(JSON.stringify(err2)));

                database.executeQuery("SELECT * FROM App.people WHERE id_person = " + id_person, function (err3, result2) {
                    if (err3) return done(new Error(JSON.stringify(err3)));

                    var person = result2.recordset[0];

                    assert.equal(person.email, id_person);
                    assert.equal(person.is_deleted, 1);
                    assert.equal(person.is_deleted_email, email);
                    done();
                });
            });
        });
    }


    it("#people_delete deletes a website user", function (done) {
        deleteUser(4, done);
    });


    it("#people_delete deletes a store user", function (done) {
        deleteUser(6, done);
    });


    it("#people_delete deletes a system user", function (done) {
        deleteUser(7, done);
    });

});