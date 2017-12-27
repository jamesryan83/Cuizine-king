"use strict";

/*
    This takes in the filtered postcodes file and requests the restaurant data
    for each location using the zomato api

    Run the fakedata/postcodes/postcodes.js file first if needed
    The latest bunch of locations are in the zip file in the data folder


    input files
    - _postcodes.json - the filtered postcodes list (TODO : change to postcodes.csv, json one is temporary for the suburb typeahead)

    output files
    - the files in the fakedata/stores/data folder - this is all the zomato api data.  it's zipped when it's not in use
*/


var fs = require("fs");

var request = require("request");
var postcodes = require("../postcodes/_postcodes.json");



// find unique latitude/longitudes in postcodes array
var uniqueLocations = [];
var match = false;
for (var i = 0; i < postcodes.length; i++) {
    match = false
    for (var j = 0; j < uniqueLocations.length; j++) {
        if (postcodes[i].latitude == uniqueLocations[j].latitude || postcodes[i].longitude == uniqueLocations[j].longitude) {
            match = true;
        }
    }

    if (!match) {
        uniqueLocations.push(postcodes[i]);
    }
}


console.log(uniqueLocations.length + " unique locations");


// get location data from zomato geocode api
function getZomatoLocation (lat, lng, callback) {
    var apiKey = "84be4288f84d9e8aba992282051eeeee";
    var url = "https://developers.zomato.com/api/v2.1/geocode?";
    var apiUrl = url + "lat=" + lat + "&lon=" + lng;

    request({
        url: apiUrl,
        headers: { "user-key": apiKey }
    }, function (err, res, body) {
        if (err) return callback(err);

        return callback(null, body);
    });
}


// for each unique location get the data from the zomato api
// and save to a json file in the data folder
for (var i = 0; i < uniqueLocations.length; i++) {
    (function (index) {
        getZomatoLocation(uniqueLocations[index].latitude,
            uniqueLocations[index].longitude, function (err, locationData) {
            if (err) return console.log(err);

            console.log("saving file " + index);
            fs.writeFile("./data/location-" + (index + 1) + ".json", locationData);
        });
    })(i);
}
