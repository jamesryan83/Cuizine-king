"use strict";

var testutil = require("../test-util");
var database = require("../../server/database/database");


describe("LOAD - DATABASE", function () {

    before(function (done) {
        this.timeout(6000);

        testutil.startDatabase(function () {
            database.executeQuery("CREATE TABLE testtable ( id INT IDENTITY(1,1) PRIMARY KEY, name nvarchar(64), email nvarchar(64) )", function (err) {
                if (err) return done(new Error(err));

                done();
            });
        });
    });


    after(function (done) {
        database.executeQuery("DROP TABLE IF EXISTS testtable", function (err) {
            if (err) return done(new Error(err));

            done();
        });
    });


    it("#executeQuery executes 1000 inserts (2.3s)", function (done) {
        this.timeout(10000);

        var query = "";
        var counter = 0;
        for (var i = 0; i < 1000; i++) {
            query = "INSERT INTO testtable (name, email) VALUES ('a" + i + "', 'b" + i + "')";

            database.executeQuery(query, function (err) {
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

            database.executeQuery(query, function (err) {
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

            database.executeQuery(query, function (err) {
                if (err) return done(new Error(err));

                counter++;
                if (counter >= 1000) {
                    done();
                }
            });
        }
    });

});