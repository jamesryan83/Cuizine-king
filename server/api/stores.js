"use strict";

// Stores api

var fs = require("fs");
var path = require("path");

var config = require("../config");
var storeDB = require("../procedures/_Store");
var strings = require("../../www/js/shared/i18n/en");


exports = module.exports = {

    router: null,

    mail: require("../other/mail"), // is here for testing


    init: function (router) {
        this.router = router;
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
            self.mail.sendStoreApplicationEmail(b.name, b.email, function (err2) {
                if (err2) console.log(err2);
            });

            // TODO : send internal email for new application

            return self.router.sendJson(res, result);
        });
    },


	// Update store details
	updateStoreDetails: function (req, res) {
		var b = req.body;
        var self = this;

        b.id_store = res.locals.person.id_store;
        b.id_user_doing_update = res.locals.person.id_person;

        // validate hours
        var errMsg = global.validationRules.validateHours(b);
        if (errMsg) return self.router.sendJson(res, null, errMsg, 400);

        // validate other stuff
        if (this.router.validateInputs(req, res, b, global.validationRules.updateStoreDetails))
            return;

        storeDB.stores_details_update(b, function (err, result) {
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

        // delete store from db
        storeDB.stores_delete(b, function (err, result) {
			if (err) return self.router.sendJson(res, null, err.message, err.status);

            // delete azure container
            self.blobService.deleteContainerIfExists("store" + b.id_store, function (err2) {
                if (err2) return self.router.sendJson(res, null, err2.message, err2.status);

                return self.router.sendJson(res, result);
            });
        });
	},


    // upload a store logo
    updateLogo: function (req, res) {
        var self = this;
        var b = req.body;
        var imageFile = req.file

        if (this.router.validateInputs(req, res, b, global.validationRules.updateLogo))
            return;

        // check image properties
        if (!imageFile) {
            return this.router.sendJson(res, null, strings.imageFileMissing, 400);
        } else if (imageFile.mimetype !== "image/jpeg") {
            return this.router.sendJson(res, null, strings.imageFileWrongType, 400);
        } else if (imageFile.size > 250000) {
            return this.router.sendJson(res, null, strings.imageFileTooBig, 400);
        }

        if (!req.file.buffer) {
            return this.router.sendJson(res, null, "Image missing", 400);
        }

        var imgPath = "/res/storelogos/store" + b.id_store + ".jpg";

        fs.writeFile(path.join(__dirname, "../", "../", "www", imgPath), req.file.buffer, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            self.router.sendJson(res, { url: imgPath });
        });
    },

}