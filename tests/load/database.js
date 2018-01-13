"use strict";

var assert = require("assert");

var testutil = require("../test-util");
var config = require("../../server/config");
var database = require("../../server/database/database");


describe("LOAD - DATABASE", function () {

    before(function (done) {
        testutil.startDatabase(function () {
            done();
        });
    });


    it("#executeQuery executes 1000 inserts (2.3s)", function (done) {
        this.timeout(10000);

        var query = "";
        var counter = 0;
        for (var i = 0; i < 1000; i++) {
            query = "INSERT INTO testtable (name, email) VALUES " +
                    "('" + "a" + i + "', 'b" + i + "')";

            database.executeQuery(query, function (err, result) {
                if (err) return done(new Error(err));

                counter++;
                if (counter >= 1000) {
                    done();
                }
            });
        }
    });


    it("#executeQuery executes 1000 updates (1.6s)", function (done) {
        this.timeout(10000);

        var query = "";
        var counter = 0;
        for (var i = 0; i < 1000; i++) {
            query = "UPDATE testtable SET name = 'test' WHERE id = " + (i + 1);

            database.executeQuery(query, function (err, result) {
                if (err) return done(new Error(err));

                counter++;
                if (counter >= 1000) {
                    done();
                }
            });
        }
    });


    it("#executeQuery executes 1000 deletes (1.5s)", function (done) {
        this.timeout(10000);

        var query = "";
        var counter = 0;
        for (var i = 0; i < 1000; i++) {
            query = "DELETE FROM testtable WHERE id = " + i;

            database.executeQuery(query, function (err, result) {
                if (err) return done(new Error(err));

                counter++;
                if (counter >= 1000) {
                    done();
                }
            });
        }
    });

});