"use strict";

// Stores api

var fs = require("fs");
var path = require("path");

var config = require("../config");
var storeDB = require("../procedures/_Store");
var database = require("../database/database");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    sendPage: function (req, res) {
        var self = this;

        if (res.locals.person) {
            var person = res.locals.person;

            fs.readFile(path.join(__dirname, "../", "../", "www", "generated", "_sysadmin.js"), "utf-8", function (err, js) {
                if (err) return self.router.sendJson(res, null, "Error loading page", 500);

                return res.send(js);
            });
        } else {
            return this.router.sendJson(res, null, "Not Authorized", 401);
        }
    },

}