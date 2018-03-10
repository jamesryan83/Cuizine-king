"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var data = require("../../www/js/shared/data");
var clientData = require("../fixtures/client-data");

describe("CLIENT - DATA", function () {




    it("#isStoreOpen returns valid result", function () {

        // test without storeData
        data.storeData = null;
        var isOpen = data.isStoreOpen();
        assert.equal(isOpen, null);

        data.storeData = {};
        var isOpen = data.isStoreOpen();
        assert.equal(isOpen, null);


        // add storeData
        data.storeData = clientData.storeData;


        // monday
        var result = data.isStoreOpen("10:14", "mon");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("10:15", "mon");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("11:14", "mon");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("11:15", "mon");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("20:44", "mon");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("20:45", "mon");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("21:45", "mon");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("21:45", "mon");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);


        // tuesday
        var result = data.isStoreOpen("02:10", "tue");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("09:14", "tue");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("09:15", "tue");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("10:15", "tue");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("23:59", "tue");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("00:00", "tue", 1); // midnight is start of next day
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, true);

        var result = data.isStoreOpen("02:09", "tue", 1);
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, true);


        // wednesday
        var result = data.isStoreOpen("00:00", "wed");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, false);

        var result = data.isStoreOpen("11:59", "wed");
        assert.equal(result.isDineinOpen, false);
        assert.equal(result.isDeliveryOpen, false);


        // sunday
        var result = data.isStoreOpen("20:44", "sun");
        assert.equal(result.isDineinOpen, true);
        assert.equal(result.isDeliveryOpen, true);

    });



    it("#getWhenStoreOpensOrClosesNext returns valid result", function () {

        // test without storeData
        data.storeData = null;
        var openCloseText = data.getWhenStoreOpensOrClosesNext();
        assert.equal(openCloseText, null);

        data.storeData = {};
        var openCloseText = data.getWhenStoreOpensOrClosesNext();
        assert.equal(openCloseText, null);


        // add storeData
        data.storeData = clientData.storeData;




    });


});