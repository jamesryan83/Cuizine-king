"use strict";

var assert = require("assert");
var testutil = require("../../testutil");
var database = require("../../../server/database/database");
var dbApp = require("../../../server/database/procedures/_App");


// TODO : this and test-database might be able to be moved to sql

describe("DATABASE - PEOPLE", function () {


    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    it("#people_create returns message if both users types 0", function (done) {
        dbApp.people_create({ is_system_user: 0, is_web_user: 0 }, function (err) {
            assert.equal(err.status, 400);
            assert.ok(err.message.indexOf("Values missing") !== -1);
            done();
        });
    });


    it("#people_create returns message if both users types 1", function (done) {
        dbApp.people_create({ is_system_user: 1, is_web_user: 1 }, function (err) {
            assert.equal(err.status, 400);
            assert.ok(err.message.indexOf("Both values cannot be 1") !== -1);
            done();
        });
    });


    it("#people_create creates a user", function (done) {
        this.timeout(5000);

        // create user in db
        dbApp.people_create(testutil.fakeUser, function (err, result) {

            if (err) return done(new Error(JSON.stringify(err)));

            // check user was created
            database.executeQuery("SELECT * FROM App.people", function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                assert.equal(result.recordset.length, 1);

                done();
            });
        });
    });


    it("#pending_add error message on pending email unique constraint violation", function (done) {
        dbApp.people_create(testutil.fakeUser, function (err, result) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });


//    it("#get returns a pending user by email", function (done) {
//        users.get({ email: testutil.fakeUser.email }, function (err, user) {
//            if (err) return done(new Error(JSON.stringify(err)));
//
//            assert.equal(user.id_user, null);
//            assert.equal(user.id_pending_user, 1);
//            assert.equal(user.email, testutil.fakeUser.email);
//
//            done();
//        });
//    });


//    it("#get returns a pending user by id", function (done) {
//        users.get({ id: 1 }, function (err, user) {
//            if (err) return done(new Error(JSON.stringify(err)));
//
//            assert.equal(user.id_user, null);
//            assert.equal(user.id_pending_user, 1);
//            assert.equal(user.email, testutil.fakeUser.email);
//
//            done();
//        });
//    });


//    it("#pending_move_to_users returns message when no user found", function (done) {
//        users.pending_move_to_users({ email: "blah blah", verification_token: "abcd" }, function (err) {
//            assert.equal(err.message, "Account not found");
//            done();
//        });
//    });


//    it("#pending_move_to_users moves user from pending table to actual table", function (done) {
//
//        users.pending_move_to_users({
//            email: testutil.fakeUser.email,
//            verification_token: testutil.fakeUser.verification_token
//        }, function (err) {
//            if (err) return done(new Error(JSON.stringify(err)));
//
//            users.get({ email: testutil.fakeUser.email }, function (err, user) {
//                if (err) return done(new Error(JSON.stringify(err)));
//
//                assert.equal(user.id_user, 1),
//                assert.equal(user.first_name, "Fake");
//                assert.equal(user.last_name, "McUser");
//                assert.equal(user.email, "james4165@hotmail.com");
//
//                done();
//            });
//        });
//    });


//    it("#reset_password resets the password", function (done) {
//        users.update_reset_password_token({ password: "testest", reset_password_token: "blahblah" }, function (err, result) {
//            assert.equal(err.message, "Account not found");
//            done();
//        });
//    });
//
//
//    it("#reset_password resets the password", function (done) {
//        var query = "UPDATE Auth.users SET reset_password_token = 'blah' WHERE email = '" +
//            testutil.fakeUser.email + "'";
//
//        database.executeQuery(query, function (err, result) {
//            if (err) return done(new Error(JSON.stringify(err)));
//
//            users.update_reset_password_token({ password: "12345", reset_password_token: "blah" }, function (err, result) {
//                if (err) return done(new Error(JSON.stringify(err)));
//
//                users.get({ email: testutil.fakeUser.email }, function (err, result) {
//                    if (err) return done(new Error(JSON.stringify(err)));
//
//                    assert.equal(result.password, "12345");
//                    done();
//                });
//            });
//        });
//    });


//    it("#delete trying to delete non-existent user gives message", function (done) {
//        users.delete({ email: "fake@fake.fake" }, function (err) {
//            assert.equal(err.message, "Account not found");
//            done();
//        });
//    });
//
//
//    it("#delete deletes a user", function (done) {
//        users.delete({ email: testutil.fakeUser.email }, function (err) {
//            if (err) return done(new Error(JSON.stringify(err)));
//
//            // check user was deleted
//            users.get({ email: testutil.fakeUser.email }, function (err, result) {
//                assert.equal(err.message, "Account not found");
//
//                // TODO : test store was also deleted
//
//                done();
//            });
//        });
//    });


});