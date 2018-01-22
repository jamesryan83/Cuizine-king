"use strict";

var assert = require("assert");

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




describe("DATABASE RESULT HANDLER", function () {


    // result handler
    it("#handle handles null err and result", function (done) {
        resultHandler.handle("test_null_err_result", null, null, function (err) {
            if (err) return done(new Error(err));
            done();
        });
    });


    it("#handle handles empty record set result", function (done) {
        var result = { recordset: [] };

        resultHandler.handle("test_result", null, result, function (err, output) {
            assert.equal(err.status, 500);
            assert.equal(err.message, "Server Error");
            assert.ok(output == undefined);
            done();
        });
    });


    it("#handle handles empty record set result with error message", function (done) {
        var result = { recordset: [] };

        resultHandler.handle("test_result_error", null, result, function (err, output) {
            assert.equal(err.status, 123);
            assert.equal(err.message, "test message");
            assert.ok(output == undefined);
            done();
        });
    });


    it("#handle handles record set result", function (done) {
        var result = { recordset: [{ data: "test" }] };

        resultHandler.handle("test_result", null, result, function (err, output) {
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


    it("#handle handles output", function (done) {
        var result = { output: { id_test: "22" }};

        resultHandler.handle("test_output", null, result, function (err, output) {
            if (err) return done(new Error(err));

            assert.equal(output, 22);
            done();
        });
    });


    it("#handle handles missing output", function (done) {
        var result = { output: null };

        resultHandler.handle("test_output", null, result, function (err, output) {
            assert.equal(err.status, 500);
            assert.equal(err.message, "Output missing");
            assert.ok(output == undefined);
            done();
        });
    });


    it("#handle handles null output", function (done) {
        var result = { output: { id_test: null }};

        resultHandler.handle("test_output", null, result, function (err, output) {
            if (err) return done(new Error(err));

            assert.ok(output == null);
            done();
        });
    });

});