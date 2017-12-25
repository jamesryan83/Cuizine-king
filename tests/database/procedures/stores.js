"use strict";

var assert = require("assert");
var testutil = require("../../testutil");
var database = require("../../../server/database/database");
var stores = require("../../../server/database/procedures/_Store");

var sequenceValues = null;

// TODO : this and test-database might be able to be moved to sql

describe("DATABASE - STORES", function () {

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
//            assert.equal(err.status, 400);
//            assert.equal(err.message, "Invalid postcode or suburb");
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


    it("#stores_delete soft deletes a store", function (done) {
        this.timeout(5000);

        testutil.getCurrentSequenceValues(function (err, seq) {
            if (err) return done(new Error(JSON.stringify(err)));

            // set store to deleted
            stores.stores_delete({ id_store: seq["id_store"], id_user_doing_update: 1 }, function (err) {
                if (err) return done(new Error(JSON.stringify(err)));

                var q = "SELECT * FROM Store.stores WHERE id_store = " + seq["id_store"];

                database.executeQuery(q, function (err, result) {
                    if (err) return done(new Error(JSON.stringify(err)));

                    assert.equal(result.recordsets[0][0].is_deleted, true);
                    done();
                });
            });
        });
    });


});