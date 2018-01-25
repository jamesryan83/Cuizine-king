"use strict";

// Stores api

var azure = require("azure-storage");

var mail = require("../other/mail");
var storeDB = require("../procedures/_Store");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;

//        this.blobService = azure.createBlobService();
    },


    // Get a store
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
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.companiesGet))
            return;

        b.jwt = "1234";
        b.id_user_doing_update = 1;

        storeDB.stores_create(b, function (err, result) {
            return self.router.sendJson(res, result);
        });
    },


    // user request store application
    requestStoreApplication: function (req, res) {
        var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.storeApplication))
            return;

        // send user verification email
        mail.sendStoreApplicationEmail(b.name, b.email, function (err) {
            if (err) console.log(err);
        });

        // TODO : save store application to db
        // TODO : send internal email for new application

        return self.router.sendJson(res);
    },


    uploadLogo: function (req, res) {
        console.log(req.file);

//        req.file.buffer

        res.sendStatus(200);

//        this.blobService.createContainerIfNotExists("")
    },

}