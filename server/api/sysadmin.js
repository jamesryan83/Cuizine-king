"use strict";

// Stores api

var storeDB = require("../procedures/_Store");
var database = require("../database/database");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // recreate the database
    recreateDatabase: function (req, res) {
        var b = req.body;
        var self = this;

        database.recreate(function (err, result) {
            return self.router.sendJson(res, result);
        });
    },

}