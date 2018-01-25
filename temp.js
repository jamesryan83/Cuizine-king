
var path = require("path");
var database = require("./server/database/database");

var p = path.join(__dirname, "sql", "other", "seed-admin.sql")

database.runSqlScriptSync(p, "menuthingTest")
