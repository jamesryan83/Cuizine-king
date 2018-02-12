"use strict";

// Locations api

var fs = require("fs");
var path = require("path");

exports = module.exports = {

    router: null,

    suburbData: [],
    suburbsCount: 0,


    init: function (router) {
        this.router = router;

        // load postcodes
        this.suburbData = require("../../data/postcodes/_postcodes.json");

        this.suburbsCount = this.suburbData.length;
    },


    // Get location
    getLocation: function (req, res) {
        if (!req.query || !req.query.q) {
            return this.router.sendJson(res, null, "Search term missing", 400);
        }

        var location = req.query.q.toLowerCase();
        var outputList = [];

        // find first maxNumMatches suburb name matches
        for (var i = 0; i < this.suburbsCount; i++) {
            if (this.suburbData[i].suburb.toLowerCase().indexOf(location) === 0 ||
                this.suburbData[i].postcode.indexOf(location) === 0) {

                outputList.push({
                    suburb: this.suburbData[i].suburb,
                    postcode: this.suburbData[i].postcode
                });

                if (outputList.length === 5) break;
            }
        }

        this.router.sendJson(res, outputList);
    },

}