"use strict";

var path = require("path");
var assert = require("assert");

var config = require("../../server/config");
var database = require("../../server/database/database");
var resultHandler = require("../../server/database/result-handler");


var mssqlTestError = {
    "code": "EREQUEST",
    "number": 201,
    "lineNumber": 0,
    "state": 4,
    "class": 16,
    "serverName": "JAMES-LAPTOP\\SQLEXPRESS",
    "procName": "users_pending_add",
    "originalError": {
        "info": {
            "number": 201,
            "state": 4,
            "class": 16,
            "message": "Test error",
            "serverName": "JAMES-LAPTOP\\SQLEXPRESS",
            "procName": "users_pending_add",
            "lineNumber": 0,
            "name": "ERROR",
            "event": "errorMessage"
        }
    },
    "name": "RequestError",
    "precedingErrors": []
};




describe("DATABASE", function () {


    // close database if it's open
    before(function (done) {
        database.close();
        setTimeout(function () {
            done();
        }, 1500);
    });






    // https://stackoverflow.com/questions/39716569/nodejs-unhandledpromiserejectionwarning
    it("#connect emits error on connection failure", function (done) {
        this.timeout(5000);

        setTimeout(function () {
            config.mssql.user = "fakeuser";

            database.connect();

            database.removeAllListeners("errorConnecting");
            database.once("errorConnecting", function (err) {
                config.mssql.user = "sa";
                assert.ok(err);
                done();
            });
        }, 1000);
    });


    it("#connect connects", function (done) {
        this.timeout(15000);

        if (database.isConnected) return done();

        database.once("connected", function () {
            done();
        });

        database.removeAllListeners("errorConnecting");
        database.once("errorConnecting", function (err) {
            done(new Error(err));
        });

        database.once("errorPool", function (err) {
            done(new Error(err));
        });

        database.connect();
    });


    it("#connect returns error message on invaid query", function (done) {
        var query = "Blah blah blah";

        database.executeQuery(query, function (err, result) {
            assert.ok(err.indexOf("Incorrect syntax") !== -1);
            done();
        });
    });


    it("#executeQuery executes a query", function (done) {

        // create table
        var query = "DROP TABLE IF EXISTS testtable " +
            "CREATE TABLE testtable (" +
                "id INT IDENTITY(1, 1) PRIMARY KEY NOT NULL," +
                "name NVARCHAR(45) NOT NULL," +
                "email NVARCHAR(45) NOT NULL UNIQUE)";

        database.executeQuery(query, function (err, result) {
            if (err) return done(new Error(err));

            // insert some data
            var query2 = "INSERT INTO testtable " +
                "(name, email) VALUES ('test1', 'test2')";

            database.executeQuery(query2, function (err, result) {
                if (err) return done(new Error(err));

                // check the data is there
                var query3 = "SELECT * FROM testtable";

                database.executeQuery(query3, function (err, result) {
                    if (err) return done(new Error(err));

                    result = result.recordset[0];
                    assert.equal(result.id, 1);
                    assert.equal(result.name, "test1");
                    assert.equal(result.email, "test2");

                    database.executeQuery("DROP TABLE testtable", function (err, result) {
                        if (err) return done(new Error(err));

                        done();
                    });
                });
            });
        });
    });


    it("#close closes the connection pool", function (done) {
        database.close();
        setTimeout(function () {
            assert.ok(!database.isConnected);
            done();
        }, 1000);
    });


    // result handler
    it("#handle handles null err and result", function (done) {
        resultHandler.handle("test2", null, null, function (err) {
            if (err) return done(new Error(err));
            done();
        });
    });


    it("#handle handles empty record set result error", function (done) {
        var result = { recordset: [] };

        resultHandler.handle("test", null, result, function (err, output) {
            assert.ok(err.message.length > 0 && err.status > 0);
            done();
        });
    });


    it("#handle handles empty record set result", function (done) {
        var result = { recordset: [] };

        resultHandler.handle("test2", null, result, function (err, output) {
            if (err) return done(new Error(err));

            assert.ok(output == undefined);
            done();
        });
    });


    it("#handle handles record set result", function (done) {
        var result = { recordset: [{ data: "test" }] };

        resultHandler.handle("test", null, result, function (err, output) {
            if (err) return done(new Error(err));

            assert.equal(output.data, "test");
            done();
        });
    });


    it("#handle handles error withotut originalError", function (done) {
        var error = {}

        resultHandler.handle(null, error, null, function (err) {
            assert.equal(err.message, "Server Error");
            assert.equal(err.status, 500);
            done();
        });
    });


    it("#handle handles error", function (done) {
        var error = JSON.parse(JSON.stringify(mssqlTestError));

        resultHandler.handle(null, error, null, function (err) {
            assert.equal(err.message, "Test error");
            done();
        });
    });


    it.skip("#runBatchFileSync does something", function () {

    });


    it.skip("procedures return message for missing parameters", function (done) {

    });

});