"use strict";

// Stores api

var fs = require("fs");
var path = require("path");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // TODO : check this
    sendPage: function (req, res) {
        var self = this;

        if (res.locals.person) {
            var filename = path.join(__dirname, "../", "../", "www", "generated", "_sysadmin.js");

            fs.readFile(filename, "utf-8", function (err, js) {
                if (err) return self.router.sendJson(req, res, null, {
                    message: "errorLoadingPage", status: 500 });

                return res.send(js);
            });
        } else {
            return this.router.sendJson(req, res, null, {
                message: "notAuthorized", status: 401 });
        }
    },

}