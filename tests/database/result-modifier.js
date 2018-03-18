"use strict";

var fs = require("fs");
var assert = require("assert");

var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");
var dbStores = require("../../server/procedures/_Store");
var resultHandler = require("../../server/database/result-handler");
var resultModifier = require("../../server/database/result-modifier");


var testStoreData = {};


describe("DATABASE RESULT MODIFIER", function () {

    before(function (done) {
        this.timeout(10000);

        testutil.startDatabase(function () {

            // get a store for testing
            dbStores.stores_get({ id_store: config.dbConstants.adminStore }, function (err, result) {
                result = database.resultHandler.getData(result, 400, "storeNotFound", true);

                if (result.err) return done(new Error(JSON.stringify(result.err)));
                if (!result.data) return done(new Error(JSON.stringify("No store data")));

                testStoreData = result.data

                done();
            });
        });
    });


    it("#storesGetStore modifies store data", function () {
        var storeData = JSON.parse(JSON.stringify(testStoreData));

        var result = resultModifier.storesGetStore(storeData);

        console.log(result)
    });

});