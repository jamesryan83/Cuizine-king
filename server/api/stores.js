"use strict";

// Stores api

var storeDB = require("../procedures/_Store");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    get: function (req, res) {
        var self = this;

        if (!req.query || !req.query.id_store) {
            return self.router.sendJson(res, null, "Store Id missing");
        }

        if (this.router.validateInputs(req, res, req.query, global.validationRules.getStore))
            return;

        storeDB.stores_get({ id_store: Number(req.query.id_store) }, function (err, result) {
            return self.router.sendJson(res, result);
        });
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