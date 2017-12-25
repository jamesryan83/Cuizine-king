"use strict";

// Stores api

var storeDB = require("../database/procedures/_Store");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    get: function (req, res) {
        var b = req.body;
    },


    // create store
    create: function (req, res) {
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.companiesGet))
            return;

        b.jwt = "1234";
        b.id_user_doing_update = 1;

        storeDB.stores_create(b, function (err, result) {
            return self.router.sendJson(res, result);
        });
    },


    // Update store
    update: function (req, res) {
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.companiesUpdate))
            return;
    },


    // Delete store
    delete: function (req, res) {
        var b = req.body;
    },


}