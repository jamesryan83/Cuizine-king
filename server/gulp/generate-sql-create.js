"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");
var recursiveReadSync = require("recursive-readdir-sync");

var config = require("../config");


// Create generated sql files
exports = module.exports = {

    start: function () {
        var outputSql = "";
        var testDBName = config.mssql.database + "Test";


        // output filepaths
        var sqlPath = path.join(__dirname, "../", "../", "sql");
        var sqlPathTests = path.join(__dirname, "../", "../", "tests", "sql");


        // Sql file paths
        var sqlTableFilePaths = recursiveReadSync(path.join(sqlPath, "tables"));
        var sequencesFile = fs.readFileSync(path.join(sqlPath, "other", "sequences.sql"), "utf-8");
        var schemasFile = fs.readFileSync(path.join(sqlPath, "other", "schemas.sql"), "utf-8");
        var storedProcedureFilePaths = recursiveReadSync(path.join(sqlPath, "procedures"));





        // ---------------------- _recreate-db.sql ----------------------

        outputSql =
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

        fs.writeFileSync(path.join(sqlPath, "_recreate-db.sql"), outputSql);
        fs.writeFileSync(path.join(sqlPathTests, "_recreate-db.sql"), outputSqlTests);





        // ---------------------- _create.sql ----------------------

        outputSql =
            "-- GENERATED FILE\n\n" +
            "USE " + config.mssql.database + "\n" +
            "GO\n\n";

        outputSql += "\n\n\n -- Create Schemas\n\n";
        outputSql += schemasFile;

        outputSql += "\n\n\n -- Create Sequences\n\n";
        outputSql += sequencesFile;

        // save -- just rename USE <db> and do manually for test DB
        fs.writeFileSync(path.join(sqlPath, "_create.sql"), outputSql);
        outputSql = outputSql.replace("USE " + config.mssql.database, "USE " + testDBName);
        fs.writeFileSync(path.join(sqlPathTests, "_create.sql"), outputSql);






        // ---------------------- _recreate.sql ----------------------

        // parts that make up the _recreate.sql output
        var dropConstraints = [];
        var dropTables = [];
        var dropProcedures = [];
        var resetSequences = [];
        var tables = [];
        var tableConstraints = [];
        var storedProcedures = [];


        // Add tables and constraints to arrays
        outputSql += "\n\n\n -- Create Tables\n\n";
        for (var i = 0; i < sqlTableFilePaths.length; i++) {
            var table = fs.readFileSync(sqlTableFilePaths[i], "utf-8").split("GO");
            tables.push(table[0].trim());

            var tempTableConstraints = table[1].trim();
            if (tempTableConstraints && tempTableConstraints.length > 0)
                tableConstraints.push(tempTableConstraints);
        }


         // Create drop contraint statements array
        var regexExtractConstraint = /(\s*)ALTER(\s*)TABLE(\s*)(\S*)(\s*)ADD(\s*)CONSTRAINT(\s*)(\w*)/i;
        for (var i = 0; i < tableConstraints.length; i++) {
            var temp = tableConstraints[i].split(os.EOL);

            for (var j = 0; j < temp.length; j++) {
                var match = regexExtractConstraint.exec(temp[j]);

                if (match) {
                    // find the schema or use dbo
                    var schema = "dbo";
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
        for (var i = 0; i < sqlTableFilePaths.length; i++) {
            var filename = path.parse(sqlTableFilePaths[i]).name;
            var newFilename = filename.replace(/-/gmi, "_");
            var dirName = path.parse(sqlTableFilePaths[i]).dir.split("\\");
            var schema = dirName[dirName.length - 1];
            var tableName = schema + "." + newFilename;

            // check if it's a temporal table
            var table = fs.readFileSync(sqlTableFilePaths[i], "utf-8");
            if (regexCheckIfTemporal.exec(table)) {
                dropTables.push(
                    "IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + schema + "' AND TABLE_NAME = '" + newFilename + "')\n" +
                    "BEGIN\n" +
                    "ALTER TABLE " + tableName + " SET (SYSTEM_VERSIONING = OFF)\n" +
                    "END"
                );
            }

            if (schema == "tables") { // tables is just the server/sql/tables folder
                dropTables.push("DROP TABLE IF EXISTS " + newFilename);
            } else {
                dropTables.push("DROP TABLE IF EXISTS " + tableName);
            }
        }


        // Create reset sequences array
        var sequenceLines = sequencesFile.split(os.EOL);
        for (var i = 0; i < sequenceLines.length; i++) {
            if (sequenceLines[i].trim().length === 0) continue;

            var temp = sequenceLines[i].split("AS INT");
            if (temp.length != 2) temp = sequenceLines[i].split("AS TINYINT");
            temp = temp[0].replace("CREATE SEQUENCE", "ALTER SEQUENCE");
            temp += "RESTART WITH 1";
            resetSequences.push(temp);
        }


        // stored procedures
        var regexExtractProcedure = /(\s*)CREATE(\s*)PROCEDURE(\s*)(\S*)(\s*)/i;
        for (var i = 0; i < storedProcedureFilePaths.length; i++) {
            var sp = fs.readFileSync(storedProcedureFilePaths[i], "utf-8");
            storedProcedures.push(sp.trim());

            // create drop procedure statements
            var match = regexExtractProcedure.exec(sp);
            if (match) {
                dropProcedures.push("DROP PROCEDURE IF EXISTS " + match[4]);
            }
        }


        // output sql
        outputSql =
            "-- GENERATED FILE\n\n" +
            "USE " + config.mssql.database + "\n" +
            "GO\n\n";

        outputSql += "\n\n\n -- Drop Constraints\n\n";
        outputSql += dropConstraints.join("\n");
        outputSql += "\n\n\n -- Drop Tables\n\n";
        outputSql += dropTables.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Drop Procedures\n\n";
        outputSql += dropProcedures.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Reset Sequences\n\n";
        outputSql += resetSequences.join("\n");
        outputSql += "\n\n\n -- Create Tables\n\n";
        outputSql += tables.join("\n\n\n");
        outputSql += "\n\n\n -- Create Constraints\n\n";
        outputSql += tableConstraints.join("\n");
        outputSql += "\nGO";
        outputSql += "\n\n\n -- Create Stored Procedures\n\n";
        outputSql += storedProcedures.join("\n\n\n");


        // save
        fs.writeFileSync(path.join(sqlPath, "_recreate.sql"), outputSql);

        outputSql = outputSql.replace("USE " + config.mssql.database, "USE " + testDBName);
        fs.writeFileSync(path.join(sqlPathTests, "_recreate-all.sql"), outputSql);

        // save dev copy without delete postcodes table stuff, it doesn't change really and its too slow to keep recreating all the time
        outputSql = outputSql.replace("DROP TABLE IF EXISTS App.postcodes", "");
        outputSql = outputSql.replace("ALTER SEQUENCE Sequences.id_postcode RESTART WITH 1", "");
        outputSql = outputSql.replace(/CREATE TABLE App\.postcodes[^]*?CREATE/, "CREATE");

        fs.writeFileSync(path.join(sqlPathTests, "_recreate.sql"), outputSql);


        // copy postcodes file to tests folder
//        var postcodesData = fs.readFileSync(path.join(sqlPath, "seed", "_seed-postcodes.sql"), "utf-8");
//        postcodesData = postcodesData.replace("USE " + config.mssql.database, "USE " + testDBName);
//        fs.writeFileSync(path.join(sqlPathTests, "_seed-postcodes.sql"), postcodesData);



        // ---------------------- _get-sequences.sql ----------------------

        outputSql =
            "-- GENERATE FILE\n\n" +
            "USE " + config.mssql.database + "\n\n";

        // Create reset sequences array
        for (var i = 0; i < sequenceLines.length; i++) {
            if (sequenceLines[i].trim().length === 0) continue;

            var temp = sequenceLines[i].split(" AS ");
            temp = temp[0].replace("CREATE SEQUENCE Sequences.", "");

            outputSql +=
                "SELECT name, current_value FROM sys.sequences WHERE name = '" +
                    temp + "'" + "\n";
        }

        // save
        fs.writeFileSync(path.join(sqlPath, "_get-sequences.sql"), outputSql);
        outputSql = outputSql.replace("USE " + config.mssql.database, "USE " + testDBName);
        fs.writeFileSync(path.join(sqlPathTests, "_get-sequences.sql"), outputSql);
    },

}
