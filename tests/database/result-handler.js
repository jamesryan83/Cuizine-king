"use strict";

var fs = require("fs");
var os = require("os");
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


    it("result-handler file contains all stored procedures", function (done) {
        var proceduresApp = require("../../server/procedures/_App");
        var proceduresStore = require("../../server/procedures/_Store");

        // get all procedure function names
        var procedures =
            Object.keys(proceduresApp)
            .concat(Object.keys(proceduresStore));


        // get all handled procedures
        var handledProcedures = [];
        var caseRegex = /^\s*case\s*(.*)\s*$/gmi;
        var resultHandlerText = fs.readFileSync("../server/database/result-handler.js", "utf-8");
        resultHandlerText.replace(caseRegex, function(match, captureGroup1) {
            handledProcedures.push(captureGroup1.substr(1, captureGroup1.length - 3));
        });


        // remove handled test procedures
        handledProcedures = handledProcedures.filter(x => x.indexOf("test") !== 0);


        // compare arrays, they should have the same elements, might be different order though
        function compareArrays(ar1, ar2, errMessage) {
            var match = false;
            for (var i = 0; i < ar1.length; i++) {
                match = false;
                for (var j = 0; j < ar2.length; j++) {
                    if (ar1[i] === ar2[j]) {
                        match = true;
                        break;
                    }
                }

                if (!match) throw new Error(errMessage + ar1[i]);
            }
        }

        compareArrays(procedures, handledProcedures, "Procedure missing from result-handler: ");
        compareArrays(handledProcedures, procedures, "Extra procedure in result-handler: ");

        // check arrays are the same length, just incase
        if (procedures.length !== handledProcedures.length) {
            return done(new Error("procedures.length !== handledProcedures.length"));
        }

        done();
    });



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

        resultHandler.handle("test_output", null, result, function (err, outputs) {
            if (err) return done(new Error(err));

            assert.equal(outputs.id_test, 22);
            done();
        });
    });


    it("#handle handles missing output", function (done) {
        var result = { output: null };

        resultHandler.handle("test_output", null, result, function (err, outputs) {
            assert.equal(err.status, 500);
            assert.equal(err.message, "Database output missing");
            assert.ok(outputs == undefined);
            done();
        });
    });


});