"use strict";

var fs = require("fs");
var os = require("os");
var config = require("../../server/config");


var locationsWithinKm = 15;

// George said do these locations first
var mainLocations = [{
    name: "Brisbane City",
    lat: -27.4679,
    long: 153.0281,
    output: []
}, {
    name: "Melbourne",
    lat: -37.814,
    long: 144.9633,
    output: []
}, {
    name: "Surfers Paradise",
    lat: -28.0027,
    long: 153.43,
    output: []
}, {
    name: "Mooloolaba",
    lat: -26.6816,
    long: 153.1192,
    output: []
}, {
    name: "Toowoomba City",
    lat: -27.5802,
    long: 151.9439,
    output: []
}];


var postcodes = fs.readFileSync("./all_postcodes.csv", "utf-8");
postcodes = postcodes.split(os.EOL);



// Create seed-postcodes.sql

var outputSql =
    "-- GENERATED FILE\n\n" +
    "USE " + config.mssql.database + "\n\n" +
    "SET NOCOUNT ON\n" +
    "SET XACT_ABORT ON\n\n" +
    "DELETE FROM App.postcodes WHERE 1 = 1\n" +
    "ALTER SEQUENCE Sequences.id_postcode RESTART WITH 1\n\n" +
    "BEGIN TRANSACTION\n";


var outputLocations = [];

// get list of outputLocations
for (var i = 0; i < mainLocations.length; i++) {
    for (var j = 1; j < postcodes.length; j++) {
        var pc = postcodes[j].split(",");

        if (isLocationWithinDistance({ lat: Number(pc[3]), long: Number(pc[4]) }, mainLocations[i])) {
            if (outputLocations.indexOf(postcodes[j]) === -1) {
                outputLocations.push(postcodes[j]);
            }
        }
    }
}



// sql insert statements
for (var i = 0; i < outputLocations.length; i++) {
    var pc = outputLocations[i].split(",");

    outputSql +=
        ("\tINSERT INTO App.postcodes " +
            "(postcode, suburb, state, latitude, longitude) " +
            "VALUES ('" + pc[0] + "','" + pc[1] + "','" + pc[2] + "'," + pc[3] + "," + pc[4] + ")\n");
}

outputSql += "COMMIT\n";


// find locations within a distace from a lat/long
// https://stackoverflow.com/a/24680708
function isLocationWithinDistance(checkPoint, centerPoint) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.long - checkPoint.long) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;

    return Math.sqrt(dx * dx + dy * dy) <= locationsWithinKm;
}


fs.writeFileSync("../../server/sql/seed/_seed-postcodes.sql", outputSql);




// Create _postcodes.json which is used for the location api and
// suburb search typeaheads
var outputJson = [];
var outputCsv = "postcode,suburb,state,latitude,longitude\n";
for (var i = 0; i < outputLocations.length; i++) {
    var pc = outputLocations[i].split(",");

    outputJson.push({
        postcode: pc[0],
        suburb: pc[1],
        state: pc[2],
        latitude: pc[3],
        longitude: pc[4]
    });

    outputCsv += pc[0] + "," + pc[1] + "," + pc[2] + "," + pc[3] + "," + pc[4] + "\n";
}
console.log(outputJson.length)
outputJson = JSON.stringify(outputJson).replace(/''/gmi, "'");


fs.writeFileSync("./_postcodes.json", outputJson);
fs.writeFileSync("./_postcodes.csv", outputCsv);
