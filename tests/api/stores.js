"use strict";

var sinon = require("sinon");
var assert = require("assert");
var supertest = require("supertest");

var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");




describe("API - Stores", function () {

    before(function (done) {
        this.timeout(5000);

        testutil.startDatabase(function () {
            done();
        });
    });


    function createStore (data, status, jwt, callback) {
        supertest(testutil.supertestUrl)
            .post("/api/sysadmin/create-store")
            .set("Content-Type", "application/json")
            .set("authorization", "Bearer " + jwt)
            .send(data)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(status)
            .end(function (err, res) {
                return callback(err, res)
        });
    }


    it("#createStore returns unverified when a website user", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.website;

        // use website jwt
        testutil.getJwt(config.dbConstants.adminUsers.website, done, function (jwt) {
            createStore(fakeStore, 401, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
        });
    });


    it("#createStore returns unverified when a store user", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.store;

        // use store jwt
        testutil.getJwt(config.dbConstants.adminUsers.store, done, function (jwt) {
            createStore(fakeStore, 401, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.err, "Not Authorized");
                done();
            });
        });
    });


    it("#createStore creates a store", function (done) {
        var fakeStore = JSON.parse(JSON.stringify(testutil.fakeStores));
        fakeStore.id_user_doing_update = config.dbConstants.adminUsers.system;

        // use system jwt
        testutil.getJwt(config.dbConstants.adminUsers.system, done, function (jwt) {
            createStore(fakeStore, 200, jwt, function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.data.newStoreId, fakeStore.id_store);
                assert.equal(res.body.data.newPersonId, 4);  // TODO : make variable
                done();
            });
        });
    });


    it("#createStoreApplication creates a store application", function (done) {
        supertest(testutil.supertestUrl)
            .post("/api/v1/store-application")
            .set("Content-Type", "application/json")
            .send({ name: "test application", email: "teststore@email.com", message: "hey" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                assert.equal(res.body.data.newStoreApplicationId, 2); // TODO : make variable
                done();
        });
    });


    it("#getStore returns a message when store not found", function (done) {
        supertest(testutil.supertestUrl)
            .get("/api/v1/store")
            .set("Content-Type", "application/json")
            .send({ id_store: 100000 })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .end(function (err, res) {
                assert.equal(res.body.err, "Store not found");
                done();
        });
    });


    it("#getStore returns a store", function (done) {
        supertest(testutil.supertestUrl)
            .get("/api/v1/store")
            .set("Content-Type", "application/json")
            .send({ id_store: 1 })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(new Error(err));

                var data = res.body.data[0];

                assert.equal(data.id_store, 1);
                assert.ok(data.name.length > 0);
                assert.ok(data.description.length > 0);
                assert.ok(data.phone_number.length > 0);
                assert.ok(data.email.length > 0);
                assert.ok(data.logo.length > 0);
                assert.equal(data.address[0].id_address, 1);
                assert.ok(data.address[0].line1.length > 0);
                assert.ok(data.hours.length > 0);
                assert.ok(data.review_count > 0);
                assert.ok(data.products.length > 0);
                assert.ok(data.product_extras.length > 0);

                // TODO : still a few things to add

                done();
        });
    });

});