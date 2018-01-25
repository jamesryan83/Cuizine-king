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

        if (res.locals.person && res.locals.person.id_person_type === config.dbConstants.personTypes.systemuser) {
            var person = res.locals.person;

            fs.readFile(path.join(__dirname, "../", "../", "www", "generated", "_sysadmin.js"), "utf-8", function (err, js) {
                if (err) return self.router.sendJson(res, null, "Error loading page", 500);

//                return self.router.sendJson(res, { js: js });
                console.log(js)
                return res.send(js);
            });
        } else {
            return this.router.sendJson(res, null, "Not Authorized", 401);
        }
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