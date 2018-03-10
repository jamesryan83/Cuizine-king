"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");
var recursiveReadSync = require("recursive-readdir-sync");


// Create the js files that call the sql stored procedures
// This generates the js from the stored procedure sql files
exports = module.exports = {

    start: function () {
        var i = 0;

        var regexProcedure = /(\s*)CREATE OR ALTER PROCEDURE(\s*)(.*)/mi;
        var regexProcedureInput = /(\s*)@(\w*)(\s*)(\w*)\(?(\w*)\)?/mi;

        var sqlPath = path.join(__dirname, "../", "sql");
        var sqlProceduresOutputPath = path.join(__dirname, "../", "server", "procedures");


        var sqlProcedureFilePaths = recursiveReadSync(path.join(sqlPath, "procedures"));

        // Group stored procedure filepaths into their folders
        var procedurePathsObject = {};
        for (i = 0; i < sqlProcedureFilePaths.length; i++) {
            var pathParts = path.parse(sqlProcedureFilePaths[i]).dir.split(path.sep);
            var folderName = pathParts[pathParts.length - 1];

            if (folderName == "procedures") continue;

            if (!procedurePathsObject[folderName]) procedurePathsObject[folderName] = [];
            procedurePathsObject[folderName].push(sqlProcedureFilePaths[i]);
        }


        Object.keys(procedurePathsObject).forEach(function(key) {

            var outputJs =
                "// GENERATED\n\n" +
                "\"use strict\";\n\n" +
                "var sql = require(\"mssql\");\n\n" +
                "var config = require(\"../config\");\n" +
                "var database = require(\"../database/database\");\n\n" +
                "// Calls stored procedures for " + key + "\n" +
                "exports = module.exports = {\n\n";

            for (i = 0; i < procedurePathsObject[key].length; i++) {

                // get procedure name
                var sqlProcedure = fs.readFileSync(procedurePathsObject[key][i], "utf8");
                sqlProcedure = sqlProcedure.split("AS")[0];
                var procedureName = regexProcedure.exec(sqlProcedure)[3];

                // clone function name
                var functionName = procedureName.split("_");
                functionName = functionName.join("_");

                // get procedure inputs
                var procedureInputs = sqlProcedure.substr(sqlProcedure.indexOf("CREATE OR ALTER PROCEDURE"), sqlProcedure.length);
                procedureInputs = procedureInputs.replace(regexProcedure, "").trim();
                procedureInputs = procedureInputs.split(os.EOL);
                var procedureInputsOutput = "";
                for (var j = 0; j < procedureInputs.length; j++) {
                    var match = regexProcedureInput.exec(procedureInputs[j]);
                    if (!match) continue;

                    var sqlType = "";

                    // https://www.npmjs.com/package/mssql#data-types
                    switch (match[4].toUpperCase()) {
                        case "BIT": sqlType = "Bit"; break;
                        case "DECIMAL": sqlType = "Decimal"; break;
                        case "INT": sqlType = "Int"; break;
                        case "MONEY": sqlType = "Money"; break;
                        case "SMALLMONEY": sqlType = "SmallMoney"; break;
                        case "TINYINT": sqlType = "TinyInt"; break;
                        case "NVARCHAR": sqlType = "NVarChar"; break;
//                        case "TIME": sqlType = "Time(0)"; break; // don't use time, it's buggy
                        case "DATETIME2": sqlType = "DateTime2"; break;
                        case "GEOGRAPHY": sqlType = "Geography"; break;
                    }

                    if (procedureInputs[j].indexOf(" OUTPUT") === -1) {
                        procedureInputsOutput +=
                            "\t\t\t.input(\"" + match[2] + "\", sql." + sqlType + ", inputs." + match[2] + ")\n";
                    } else {
                        procedureInputsOutput +=
                            "\t\t\t.output(\"" + match[2] + "\", sql." + sqlType + ")\n";
                    }
                }


                // create js function
                var jsFunction =
                    "\t// " + key + "." + functionName + "\n" +
                    "\t" + functionName + ": function (inputs, callback) {\n" +
                        "\t\tdatabase.pool.request()\n" +
                            procedureInputsOutput +
                            "\t\t\t.execute(config.mssql.database + \".dbo." + procedureName + "\", function (err, result) {\n" +
                                "\t\t\t\tvar sqlErr = database.resultHandler.getError(err);\n" +
                                "\t\t\t\tif (sqlErr) return callback(sqlErr);\n\n" +
                                "\t\t\t\treturn callback(null, result);\n" +
                            "\t\t});\n" +
                        "\t},\n\n\n";

                outputJs += jsFunction;
            }

            outputJs += "}\n";

            fs.writeFileSync(path.join(sqlProceduresOutputPath, "_" + key + ".js"), outputJs);
        });
    },

}