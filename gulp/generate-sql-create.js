"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");
var recursiveReadSync = require("recursive-readdir-sync");

var config = require("../server/config");


// Create generated sql files
exports = module.exports = {

    start: function () {
        var testDBName = config.mssql.database + "Test";

        var i = 0;
        var schema = "";
        var table = "";
        var temp = "";
        var match = false;
        var placeholder = "";
        var value = "";
        var re = "";


        // arrays of sql statements that make up the various outputs
        var dropConstraints = [];
        var dropTables = [];
        var resetSequences = [];
        var dropSequences = [];
        var tables = [];
        var tableConstraints = [];
        var functions = [];
        var dropFunctions = [];
        var storedProcedures = [];
        var dropProcedures = [];
        var dropSchemas = [];


        // output filepaths
        var sqlFolderPath = path.join(__dirname, "../", "sql");
        var sqlOutputFolderPath = path.join(sqlFolderPath, "generated");


        // Sql file paths
        var sqlTableFilePaths = recursiveReadSync(path.join(sqlFolderPath, "tables"));
        var sequencesFile = fs.readFileSync(path.join(sqlFolderPath, "other", "sequences.sql"), "utf-8");
        var schemasFile = fs.readFileSync(path.join(sqlFolderPath, "other", "schemas.sql"), "utf-8");
        var constantsFile = JSON.parse(fs.readFileSync(path.join(sqlFolderPath, "other", "constants.js"), "utf-8"));
        var procedureFilePaths = recursiveReadSync(path.join(sqlFolderPath, "procedures"));
        var functionFilePaths = recursiveReadSync(path.join(sqlFolderPath, "functions"));





        // ---------------------- _recreate-db.sql ----------------------

        // these drop and create the db or test db

        var outputSql =
            "-- GENERATED FILE\n\n" +
            "USE master\n\n" +
            "IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'" + config.mssql.database + "')\n" +
            "BEGIN\n" +
                "ALTER DATABASE " + config.mssql.database + " SET SINGLE_USER WITH ROLLBACK IMMEDIATE\n" +
                "DROP DATABASE " + config.mssql.database + "\n" +
            "END\n" +
            "CREATE DATABASE " + config.mssql.database + "\n\n" +
            "GO\n";

        var outputSqlTests =
            "-- GENERATED FILE\n\n" +
            "USE master\n\n" +
            "IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'" + testDBName + "')\n" +
            "BEGIN\n" +
                "ALTER DATABASE " + testDBName + " SET SINGLE_USER WITH ROLLBACK IMMEDIATE\n" +
                "DROP DATABASE " + testDBName + "\n" +
            "END\n" +
            "CREATE DATABASE " + testDBName + "\n\n" +
            "GO\n";

        fs.writeFileSync(path.join(sqlOutputFolderPath, "_create-db.sql"), outputSql);
        fs.writeFileSync(path.join(sqlOutputFolderPath, "_create-test-db.sql"), outputSqlTests);






        // ---------------------- _schemas-sequences.sql ----------------------

        // creates schemas and sequences

        outputSql = "-- GENERATED FILE\n\n";
        outputSql += "\n\n\n -- Create Schemas\n\n";
        outputSql += schemasFile;
        outputSql += "\n\n\n -- Create Sequences\n\n";
        outputSql += sequencesFile;

        // save
        fs.writeFileSync(path.join(sqlOutputFolderPath, "_schemas-sequences.sql"), outputSql);






        // ---------------------- _recreate.sql ----------------------



        // Add tables and constraints to arrays
        outputSql += "\n\n\n -- Create Tables\n\n";
        for (i = 0; i < sqlTableFilePaths.length; i++) {
            table = fs.readFileSync(sqlTableFilePaths[i], "utf-8").split("GO");
            tables.push(table[0].trim());

            var tempTableConstraints = table[1].trim();
            if (tempTableConstraints && tempTableConstraints.length > 0)
                tableConstraints.push(tempTableConstraints);
        }


         // Create drop contraint statements array
        var regexExtractConstraint = /(\s*)ALTER(\s*)TABLE(\s*)(\S*)(\s*)ADD(\s*)CONSTRAINT(\s*)(\w*)/i;
        for (i = 0; i < tableConstraints.length; i++) {
            temp = tableConstraints[i].split(os.EOL);

            for (var j = 0; j < temp.length; j++) {
                match = regexExtractConstraint.exec(temp[j]);

                if (match) {
                    // find the schema or use dbo
                    schema = "dbo";
                    var parts = match[4].split(".");
                    if (parts.length > 1) {
                        schema = parts[0];
                    }

                    dropConstraints.push(
                        "IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + schema + "' AND TABLE_NAME = '" + (parts.length > 1 ? parts[1] : parts[0]) + "')\n" +
                        "BEGIN\n" +
                        "ALTER TABLE " + match[4] + " DROP CONSTRAINT " + match[8] + "\n" +
                        "END");
                }
            }
        }


        // Create drop table statements array
        var regexCheckIfTemporal = /SYSTEM_VERSIONING = ON/i;
        for (i = 0; i < sqlTableFilePaths.length; i++) {
            var filename = path.parse(sqlTableFilePaths[i]).name;
            var newFilename = filename.replace(/-/gmi, "_");
            var dirName = path.parse(sqlTableFilePaths[i]).dir.split("\\");
            schema = dirName[dirName.length - 1];
            var tableName = schema + "." + newFilename;

            // check if it's a temporal table
            table = fs.readFileSync(sqlTableFilePaths[i], "utf-8");
            if (regexCheckIfTemporal.exec(table)) {
                dropTables.push(
                    "IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + schema + "' AND TABLE_NAME = '" + newFilename + "')\n" +
                    "BEGIN\n" +
                    "ALTER TABLE " + tableName + " SET (SYSTEM_VERSIONING = OFF)\n" +
                    "END\n" +
                    "DROP TABLE IF EXISTS " + tableName + "_history"); // also drop history table
            }

            dropTables.push("DROP TABLE IF EXISTS " + tableName);
        }


        // Create reset sequences array
        var sequenceLines = sequencesFile.split(os.EOL);
        for (i = 0; i < sequenceLines.length; i++) {
            if (sequenceLines[i].trim().length === 0) continue;

            temp = sequenceLines[i].split("AS INT");
            if (temp.length != 2) temp = sequenceLines[i].split("AS TINYINT");
            temp = temp[0].replace("CREATE SEQUENCE", "ALTER SEQUENCE");

            dropSequences.push(temp.replace("ALTER SEQUENCE", "DROP SEQUENCE IF EXISTS"));

            temp += "RESTART WITH 1";

            resetSequences.push(temp);
        }


        // functions
        var regexExtractFunction = /(\s*)CREATE(\s*)OR(\s*)ALTER(\s*)FUNCTION(\s*)(\S*)(\s*)(\()/i;
        for (i = 0; i < functionFilePaths.length; i++) {
            var fun = fs.readFileSync(functionFilePaths[i], "utf-8");
            functions.push(fun.trim());

            match = regexExtractFunction.exec(fun);
            if (match) {
                dropFunctions.push("DROP FUNCTION IF EXISTS " + match[6]);
            }
        }


        // stored procedures
        var regexExtractProcedure = /(\s*)CREATE(\s*)OR(\s*)ALTER(\s*)PROCEDURE(\s*)(\S*)(\s*)/i;
        for (i = 0; i < procedureFilePaths.length; i++) {
            var sp = fs.readFileSync(procedureFilePaths[i], "utf-8");
            storedProcedures.push(sp.trim());

            match = regexExtractProcedure.exec(sp);
            if (match) {
                dropProcedures.push("DROP PROCEDURE IF EXISTS " + match[6]);
            }
        }


        // output sql
        outputSql = "-- GENERATED FILE\n\n";

        outputSql += "\n\n\n -- Drop Constraints\n\n";
        outputSql += dropConstraints.join("\n");
        outputSql += "\n\n\n -- Drop Tables\n\n";
        outputSql += dropTables.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Reset Sequences\n\n";
        outputSql += resetSequences.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Create Tables\n\n";
        outputSql += tables.join("\n\n\n");
        outputSql += "\n\n\n -- Create Constraints\n\n";
        outputSql += tableConstraints.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Create Functions\n\n";
        outputSql += functions.join("\n\n\n");
        outputSql += "\n\n\n -- Create Stored Procedures\n\n";
        outputSql += storedProcedures.join("\n\n\n");


        // replace placeholders with constants
        for (i = 0; i < Object.keys(constantsFile).length; i++) {
            placeholder = Object.keys(constantsFile)[i];
            value = constantsFile[placeholder];
            re = new RegExp(placeholder, "gi");
            outputSql = outputSql.replace(re, value);
        }


        // save
        fs.writeFileSync(path.join(sqlOutputFolderPath, "_recreate.sql"), outputSql);





        // ---------------------- _recreate-keep-constants.sql ----------------------

        // save copy without altering constants stuff like postcodes and types
        outputSql = outputSql.replace("DROP TABLE IF EXISTS App.postcodes", "");
        outputSql = outputSql.replace("DROP TABLE IF EXISTS App.order_types", "");
        outputSql = outputSql.replace("DROP TABLE IF EXISTS App.payment_methods", "");
        outputSql = outputSql.replace("ALTER SEQUENCE Sequences.id_postcode RESTART WITH 1", "");
        outputSql = outputSql.replace("ALTER SEQUENCE Sequences.id_order_type RESTART WITH 1", "");
        outputSql = outputSql.replace("ALTER SEQUENCE Sequences.id_payment_method RESTART WITH 1", "");
        outputSql = outputSql.replace(/CREATE TABLE App\.postcodes[^]*?CREATE/, "CREATE");
        outputSql = outputSql.replace(/CREATE TABLE App\.order_types[^]*?CREATE/, "CREATE");
        outputSql = outputSql.replace(/CREATE TABLE App\.payment_methods[^]*?CREATE/, "CREATE");

        fs.writeFileSync(path.join(sqlOutputFolderPath, "_recreate-keep-constants.sql"), outputSql);






        // ---------------------- _drop-all.sql ----------------------

        // drop schema statements
        var regexExtractSchema = /(\s*)CREATE(\s*)SCHEMA(\s*)(\S*)(\s*)/ig;
        schemasFile.match(regexExtractSchema).forEach(function (item) {
            schema = item.replace(/CREATE(\s*)SCHEMA/i, "").trim();
            dropSchemas.push("DROP SCHEMA IF EXISTS " + schema);
        });


        outputSql = "-- GENERATED FILE\n\n";
        outputSql += "\n\n\n -- Drop Constraints\n\n";
        outputSql += dropConstraints.join("\n");
        outputSql += "\n\n\n -- Drop Tables\n\n";
        outputSql += dropTables.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Drop Procedures\n\n";
        outputSql += dropProcedures.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Drop Functions\n\n";
        outputSql += dropFunctions.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Drop Sequences\n\n";
        outputSql += dropSequences.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Drop Schemas\n\n";
        outputSql += dropSchemas.join("\n");
        outputSql += "\nGO";



        // save
        fs.writeFileSync(path.join(sqlOutputFolderPath, "_drop-all.sql"), outputSql);






        // ---------------------- _recreate-procedures.sql ----------------------

        outputSql = "-- GENERATED FILE\n\n";
        outputSql += "\n\n\n -- Create Stored Procedures\n\n";
        outputSql += storedProcedures.join("\n\n\n");

        // replace placeholders with constants
        for (i = 0; i < Object.keys(constantsFile).length; i++) {
            placeholder = Object.keys(constantsFile)[i];
            value = constantsFile[placeholder];
            re = new RegExp(placeholder, "gi");
            outputSql = outputSql.replace(re, value);
        }

        fs.writeFileSync(path.join(sqlOutputFolderPath, "_recreate-procedures.sql"), outputSql);






        // ---------------------- _get-sequences.sql ----------------------

        outputSql = "-- GENERATED FILE\n\n";

        // Create reset sequences array
        for (i = 0; i < sequenceLines.length; i++) {
            if (sequenceLines[i].trim().length === 0) continue;

            temp = sequenceLines[i].split(" AS ");
            temp = temp[0].replace("CREATE SEQUENCE Sequences.", "");

            outputSql +=
                "SELECT name, current_value FROM sys.sequences WHERE name = '" +
                    temp + "'\n";
        }

        // save
        fs.writeFileSync(path.join(sqlOutputFolderPath, "_get-sequences.sql"), outputSql);

    },

}
