"use strict";

// Main Database file
// https://github.com/patriksimek/node-mssql

var path = require("path");
var mssql = require("mssql");
var EventEmitter = require("events");
var execSync = require("child_process").execSync;

var config = require("../config");


var ee = new EventEmitter();


exports = module.exports = {

    mssql: mssql,
    isConnected: false,
    pool: undefined,

    // some event emitter events
    on: ee.on.bind(ee),
    once: ee.once.bind(ee),
    removeListener: ee.removeListener.bind(ee),
    removeAllListeners: ee.removeAllListeners.bind(ee),



    // Connect to database
    connect: function () {
        var self = this;

        if (!config) throw new Error("Database config is missing");

        this.pool = new mssql.ConnectionPool(config.mssql, function (err) {
            if (err) {
                self.isConnected = false;
                ee.emit("errorConnecting", err);
                return;
            }

            self.isConnected = true;
            ee.emit("connected");
        });

        this.pool.on("error", function (err) {
            self.isConnected = false;
            console.log("pool error");
            ee.emit("errorPool", err);
        });
    },


    // TODO : parameterized inputs
    // Execute an sql query
    executeQuery: function (query, callback) {
        if (!query) return callback("query missing");

        this.pool.request().query(query, function (err, result) {
            if (err) return callback(err.message); // TODO : check err msg isn't jibberish

            return callback(null, result);
        });
    },



    // Close the connection pool
    close: function () {
        if (this.pool) {
            this.isConnected = false;
            this.pool.close();
        }
    },



    // Runs an sql script in another process and waits for result
    runSqlScriptSync: function (scriptPath) {
        try {
            var result = execSync("Sqlcmd -S localhost -i " + scriptPath);

            if (global.logSQLerrors) console.log(result.toString("utf-8").trim());

            return null;
        } catch (ex) {
            return ex.message;
        }
    },


    // Runs a batch file
    runBatchFileSync: function (batchFileName, cwd) {
        var result = execSync(batchFileName, { cwd: cwd, encoding: "utf-8" });
        console.log(result);
    }

}
