"use strict";

var assert = require("assert");

var config = require("../../server/config");
var database = require("../../server/database/database");



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

        database.executeQuery(query, function (err) {
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

        database.executeQuery(query, function (err) {
            if (err) return done(new Error(err));

            // insert some data
            var query2 = "INSERT INTO testtable " +
                "(name, email) VALUES ('test1', 'test2')";

            database.executeQuery(query2, function (err2) {
                if (err2) return done(new Error(err2));

                // check the data is there
                var query3 = "SELECT * FROM testtable";

                database.executeQuery(query3, function (err3, result) {
                    if (err3) return done(new Error(err3));

                    var res = result.recordset[0];
                    assert.equal(res.id, 1);
                    assert.equal(res.name, "test1");
                    assert.equal(res.email, "test2");

                    database.executeQuery("DROP TABLE testtable", function (err4) {
                        if (err4) return done(new Error(err4));

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


    it.skip("#runSqlScriptSync works", function () {

    });


    it.skip("#runBatchFileSync works", function () {

    });


});