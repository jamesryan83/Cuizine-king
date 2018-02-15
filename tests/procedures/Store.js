"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var config = require("../../server/config");
var mail = require("../../server/other/mail");
var storesDB = require("../../server/procedures/_Store");
var database = require("../../server/database/database");


function getFakeStore () {
    var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
    fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;
    return fakeStore;
}


describe("PROCEDURES - STORE", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });





    // ------- Reviews -------

    it.skip("#reviews_get returns message for store not found", function (done) {

    });


    it.skip("#reviews_get returns reviews for a store", function (done) {

    });






    // ------- Store application -------

    it("#stores_applications_create creates a store application", function (done) {
        var testApplication = {
            name: "testname",
            email: "test@email.com",
            message: "some kinda message",
            internal_notes: "some notes",
            id_user_doing_update: config.dbConstants.adminUsers.system
        };

        storesDB.store_applications_create(testApplication, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(outputs.newStoreApplicationId, 2); // TODO : make variable
            done();
        });
    });






    // ------- Create a store -------

    it("#stores_create returns unauthorized when store user", function (done) {
        var fakeStore = getFakeStore();
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.store;

        storesDB.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_create returns unauthorized when website user", function (done) {
        var fakeStore = getFakeStore();
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.website;

        storesDB.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_create returns message for invalid postcode", function (done) {
        var fakeStore = getFakeStore();
        fakeStore.postcode = "9999";

        storesDB.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#stores_create returns message for invalid suburb", function (done) {
        var fakeStore = getFakeStore();
        fakeStore.suburb = "blahblahblah";

        storesDB.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#stores_create creates a store, address and user", function (done) {
        var fakeStore = getFakeStore();

        storesDB.stores_create(fakeStore, function (err, outputs) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.equal(outputs.newStoreId, fakeStore.id_store);
            assert.ok(outputs.newPersonId > 3); // TODO : make variable

            var query =
                "SELECT * FROM App.people " +
                "SELECT * FROM App.addresses " +
                "SELECT * FROM Store.stores_people";

            // check data was inserted in other tables
            database.executeQuery(query, function (err, result) {
                var people = result.recordsets[0];
                var addresses = result.recordsets[1];
                var stores_people = result.recordsets[2];

                assert.equal(people[3].email, fakeStore.email_user);
                assert.equal(addresses.length, 2); // TODO : make variable
                assert.equal(stores_people.length, 2);

                done();
            });
        });
    });


    it("#stores_create returns an error when the email exists", function (done) {
        var fakeStore = getFakeStore();

        storesDB.stores_create(fakeStore, function (err) {
            assert.equal(err.status, 409);
            assert.equal(err.message, "Account already taken");
            done();
        });
    });






    // ------- Get Store -------

    it("#stores_get returns message when store not found", function (done) {
        storesDB.stores_get({ "id_store": 0 }, function (err, result) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#stores_get returns store", function (done) {
        storesDB.stores_get({ "id_store": 1 }, function (err, store) {
            if (err) return done(new Error(JSON.stringify(err)));

            assert.ok(store);
            assert.equal(store.id_store, 1);
            assert.ok(store.name);
            assert.ok(store.description);
            assert.ok(store.email);
            assert.ok(store.phone_number);
            assert.ok(store.address.length > 0);
            assert.ok(store.hours.length > 0);
            assert.ok(store.review_count > 0);
            assert.ok(store.products.length > 0);
            assert.ok(store.products[0].options.length > 0);
            assert.ok(store.product_extras.length > 0);
            assert.ok(store.product_headings.length > 0);

            done();
        });
    });







    // ------- Update Store -------

    it("#stores_details_update returns message when store not found", function (done) {
        var tempData = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));
        tempData.id_store = 999999;

        storesDB.stores_details_update(tempData, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#stores_details_update returns unauthorized when not member of store", function (done) {
        var tempData = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));
        tempData.id_user_doing_update = 4;

        storesDB.stores_details_update(tempData, function (err) {
            console.log(err)
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_details_update returns unauthorized when website user", function (done) {
        var tempData = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));
        tempData.id_user_doing_update = config.dbConstants.adminUsers.website;

        storesDB.stores_details_update(tempData, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_details_update returns error for invalid postcode", function (done) {
        var tempData = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));
        tempData.postcode = "9999";

        storesDB.stores_details_update(tempData, function (err) {
            assert.equal(err.status, 400);
            assert.equal(err.message, "Invalid postcode or suburb");
            done();
        });
    });


    it("#stores_details_update updates store details", function (done) {
        var tempData = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));
        tempData.id_store = 1;

        storesDB.stores_details_update(testutil.fakeStoreUpdate, function (err) {
            if (err) return done(new Error(JSON.stringify(err)));

            storesDB.stores_get({ "id_store": 1 }, function (err, store) {
                if (err) return done(new Error(JSON.stringify(err)));

                assert.equal(store.description, testutil.fakeStoreUpdate.description);
                assert.equal(store.email, testutil.fakeStoreUpdate.email);
                assert.equal(store.phone_number, testutil.fakeStoreUpdate.phone_number);
                assert.ok(store.address.length > 0);
                assert.ok(store.hours.length > 0);
//                assert.equal(store.review_count, 0);
                assert.equal(store.address[0].street_address, testutil.fakeStoreUpdate.street_address);
                assert.equal(store.address[0].postcode, testutil.fakeStoreUpdate.postcode);
                assert.equal(store.address[0].suburb, testutil.fakeStoreUpdate.suburb);
                assert.equal(store.hours[0].hours_mon_dinein_open, testutil.fakeStoreUpdate.hours_mon_dinein_open);
                assert.equal(store.hours[0].hours_thu_dinein_close, testutil.fakeStoreUpdate.hours_thu_dinein_close);
                assert.equal(store.hours[0].hours_tue_delivery_open, testutil.fakeStoreUpdate.hours_tue_delivery_open);
                assert.equal(store.hours[0].hours_sun_delivery_close, testutil.fakeStoreUpdate.hours_sun_delivery_close);

                done();
            });
        });
    });







    // ------- Delete Store -------

    it("#stores_delete returns unauthorized when website user", function (done) {
        storesDB.stores_delete({ id_store: getFakeStore().id_store, id_user_doing_update: config.dbConstants.adminUsers.website }, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_delete returns unauthorized when store user", function (done) {
        storesDB.stores_delete({ id_store: getFakeStore().id_store, id_user_doing_update: config.dbConstants.adminUsers.store }, function (err) {
            assert.equal(err.status, 401);
            assert.equal(err.message, "Not authorized");
            done();
        });
    });


    it("#stores_delete returns message for store not found", function (done) {
        storesDB.stores_delete({ id_store: 1002020, id_user_doing_update: config.dbConstants.adminUsers.system }, function (err, result) {
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it("#stores_delete deletes a store", function (done) {
        var fakeStore = getFakeStore();

        storesDB.stores_delete({ id_store: fakeStore.id_store, id_user_doing_update: config.dbConstants.adminUsers.system }, function (err, result) {
            if (err) return done(new Error(JSON.stringify(err)));

            database.executeQuery("SELECT * FROM Store.stores WHERE id_store = " + fakeStore.id_store, function (err, result) {
                if (err) return done(new Error(JSON.stringify(err)));

                var store = result.recordset[0];

                // TODO : also check if deleted users and other stuff

                assert.equal(store.is_deleted, true);
                assert.equal(store.is_deleted_email, fakeStore.email_user);
                done();
            });
        });
    });






    // ------- Undelete Store -------

    it.skip("#stores_undelete returns message for store not found", function (done) {
        storesDB.stores_undelete({ "id_store": 1002020 }, function (err, result) {
            assert.equal(err.message, "Store not found");
            done();
        });
    });


    it.skip("#stores_undelete deletes a store", function (done) {

    });

});