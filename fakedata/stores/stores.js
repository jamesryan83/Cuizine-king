"use strict";

var fs = require("fs");

var output = [];
var outputAddresses = "";

var files = fs.readdirSync("./data");


// create addresses.txt from zomato store data
var count = 1;
for (var i = 0; i < files.length; i++) { //
    var location = JSON.parse(fs.readFileSync("./data/" + files[i], "utf-8"));

    for (var j = 0; j < location.nearby_restaurants.length; j++) { //
        var restaurant = location.nearby_restaurants[j].restaurant;

        if (restaurant.id) {
            outputAddresses +=
                restaurant.id + "|" +
                restaurant.name + "|" +
                restaurant.url + "|" +
                restaurant.cuisines + "|" +
                restaurant.thumb + "|" +
                (restaurant.has_online_delivery || "null") + "|" +
                (restaurant.location.latitude || "null") + "|" +
                (restaurant.location.longitude || "null") + "|" +
                (restaurant.location.zipcode || "null") + "|" +
                (restaurant.location.locality || "null") + "|" +
                (restaurant.location.city || "null") + "|" +
                restaurant.location.address.replace(/\n/i, " ") +
                "\n";
        }
    }
}

fs.writeFileSync("./addresses.txt", outputAddresses);