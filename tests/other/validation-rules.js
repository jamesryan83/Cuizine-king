"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var validationRules = require("../../www/js/shared/validation-rules");



describe("VALIDATION RULES", function () {

    // ------- Validate Hours -------

    it("#validateHours returns error for missing hours", function () {
        var errMsg = validationRules.validateHours();
        assert.equal(errMsg, "Data missing");

        var errMsg = validationRules.validateHours(undefined);
        assert.equal(errMsg, "Data missing");

        var errMsg = validationRules.validateHours({});
        assert.equal(errMsg, "Data missing");

        var errMsg = validationRules.validateHours(null);
        assert.equal(errMsg, "Data missing");

        var errMsg = validationRules.validateHours("");
        assert.equal(errMsg, "Data missing");
    });


    it("#validateHours returns error for invalid time", function () {
        var store = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));

        store.hours_mon_dinein_open = "7:00";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Mon Dinein Open.  Must be HH:MM");

        store.hours_mon_dinein_open = "07:00";
        store.hours_wed_dinein_close = "z";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Wed Dinein Close.  Must be HH:MM");

        store.hours_mon_dinein_open = "13:x0";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Mon Dinein Open.  Must be HH:MM");

        store.hours_mon_dinein_open = "13000";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Mon Dinein Open.  Must be HH:MM");

        store.hours_mon_dinein_open = "13:";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Mon Dinein Open.  Must be HH:MM");

        store.hours_mon_dinein_open = "13 00";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Mon Dinein Open.  Must be HH:MM");
    });


    it("#validateHours returns error if one time is null", function () {
        var store = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));

        store.hours_thu_delivery_close = null;
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Thu Delivery Close.  Open and Close must be both times or both closed");

        store.hours_thu_delivery_close = undefined;
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Thu Delivery Close.  Open and Close must be both times or both closed");

        store.hours_thu_delivery_close = "";
        var errMsg = validationRules.validateHours(store);
        assert.equal(errMsg, "Error in Hours Thu Delivery Close.  Open and Close must be both times or both closed");
    });


    it("#validateHours works with valid hours", function () {
        var store = JSON.parse(JSON.stringify(testutil.fakeStoreUpdate));

        var errMsg = validationRules.validateHours(store);
        assert.ok(!errMsg);

        store.hours_thu_delivery_close = "00:00";
        var errMsg = validationRules.validateHours(store);
        assert.ok(!errMsg);

        store.hours_thu_delivery_open = null;
        store.hours_thu_delivery_close = null;
        var errMsg = validationRules.validateHours(store);
        assert.ok(!errMsg);

        store.hours_thu_delivery_open = "";
        store.hours_thu_delivery_close = "";
        var errMsg = validationRules.validateHours(store);
        assert.ok(!errMsg);
    });

});
