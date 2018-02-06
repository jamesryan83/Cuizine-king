"use strict";

// Stores api

var azure = require("azure-storage");

var config = require("../config");
var storeDB = require("../procedures/_Store");
var strings = require("../../www/js/shared/i18n/en");


exports = module.exports = {

    router: null,

    mail: require("../other/mail"), // is here for testing


    init: function (router) {
        this.router = router;

        // https://docs.microsoft.com/en-gb/azure/storage/common/storage-use-emulator#authenticate-with-shared-key-credentials
        var devName = "devstoreaccount1";
        var devKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";

        this.blobService = azure.createBlobService(devName, devKey);
    },


    // Get a store
    getStore: function (req, res) {
        var b = req.query || req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.getStore))
            return;

        storeDB.stores_get({ id_store: b.id_store }, function (err, result) {
			if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res, result);
        });
    },


    // create store
    createStore: function (req, res) {
        var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.createStore))
            return;

        storeDB.stores_create(b, function (err, result) {
			if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res, result);
        });
    },


    // user request store application
    createStoreApplication: function (req, res) {
        var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.storeApplication))
            return;

        // set as always a system user doing the update
        b.id_user_doing_update = config.dbConstants.adminUsers.system;

        // save store application to db
        storeDB.store_applications_create(b, function (err, result) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // send user verification email
            self.mail.sendStoreApplicationEmail(b.name, b.email, function (err, result2) {
                if (err) console.log(err);
            });

            // TODO : send internal email for new application

            return self.router.sendJson(res, result);
        });
    },


	// Update a store
	updateStore: function (req, res) {
		var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.updateStore))
            return;

        storeDB.stores_update(b, function (err, result) {
			if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res, result);
        });
	},


	// Delete a store
	deleteStore: function (req, res) {
		var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.deleteStore))
            return;

        storeDB.stores_delete(b, function (err, result) {
			if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res, result);
        });
	},


    // upload a store logo
    updateLogo: function (req, res) {
        var imageFile = req.file

        // check image properties
        if (!imageFile) {
            return self.router.sendJson(res, null, strings.imageFileMissing, 400);
        } else if (imageFile.mimetype !== "image/jpeg") {
            return self.router.sendJson(res, null, strings.imageFileWrongType, 400);
        } else if (imageFile.size > 250000) {
            return self.router.sendJson(res, null, strings.imageFileTooBig, 400);
        }


//        req.file.buffer
        console.log("done")
        res.sendStatus(200);

//        this.blobService.createContainerIfNotExists("")
    },

}