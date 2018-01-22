"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var database = require("../../server/database/database");
var stores = require("../../server/procedures/_Store");

var sequenceValues = null;

// TODO : this and test-database might be able to be moved to sql

describe("DATABASE - STORE", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    it("#stores_create returns message for invalid postcode", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStore));
        fakeStore.postcode = "9999";

        stores.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#stores_create creates a store, address and user", function (done) {
        stores.stores_create(testutil.fakeStore, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            done();
        });
    });


    it("#stores_create returns an error when the email exists", function (done) {
        stores.stores_create(testutil.fakeStore, function (err) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Invalid Email. Account already exists");
            done();
        });
    });


    it("#stores_get returns message when store not found", function (done) {
        stores.stores_get({ "id_store": 0 }, function (err, result) {
            console.log(err)
            assert.equal(err.status, 400);
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#stores_get returns store", function (done) {

        stores.stores_get({ "id_store": 1 }, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(result[0])
            assert.equal(result[0].id_store, 1)
            assert.ok(result[0].name)
            assert.ok(result[0].email)
            assert.ok(result[0].address.length > 0)
            assert.ok(result[0].hours.length > 0)

            done();
        });
    });


});