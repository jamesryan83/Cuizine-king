"use strict";

var fs = require("fs");
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


    it("#getData handles null err and result", function () {
        var sqlResult = resultHandler.getData();

        assert.equal(sqlResult.err.status, 204);
        assert.equal(sqlResult.err.message, "noData");
    });



    it("#getData handles empty record set result", function () {
        var result = { recordset: [] };

        var sqlResult = resultHandler.getData(result);
        assert.equal(sqlResult.err.status, 204);
        assert.equal(sqlResult.err.message, "noData");
    });


    it("#getData handles empty record set result with error message", function () {
        var result = { recordset: [] };

        var sqlResult = resultHandler.getData(result, 123, "test message");
        assert.equal(sqlResult.err.status, 123);
        assert.equal(sqlResult.err.message, "test message");
    });


    it("#getData handles record set result", function () {
        var result = { recordset: [{ data: "test" }] };

        var sqlResult = resultHandler.getData(result);
        assert.equal(sqlResult.data.data, "test");
    });


    it("#getError handles error withotut originalError", function () {
        var error = {}

        var sqlErr = resultHandler.getError(error);
        assert.equal(sqlErr.err, null);
    });


    it("#getError handles error", function () {
        var error = JSON.parse(JSON.stringify(mssqlTestError));

        var sqlErr = resultHandler.getError(error);
        assert.equal(sqlErr.message, "Test error");
    });


    it("#getOutputs handles output", function () {
        var result = { output: { id_test: "22" }};

        var sqlResult = resultHandler.getOutputs(["id_test"], result);
        assert.equal(sqlResult.outputs.id_test, 22);
    });


    it("#getOutputs handles missing output", function () {
        var result = { output: null };

        var sqlResult = resultHandler.getOutputs([], result);
        assert.equal(sqlResult.err.status, 500);
        assert.equal(sqlResult.err.message, "outputNamesMissing");
    });


});