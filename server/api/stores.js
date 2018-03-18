"use strict";

// Stores api

var fs = require("fs");
var path = require("path");

var config = require("../config");
var storeDB = require("../procedures/_Store");
var database = require("../database/database");
var resultModifier = require("../database/result-modifier");


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
			if (err) return self.router.sendJson(req, res, null, err);

            result = database.resultHandler.getData(result, 400, "storeNotFound", true);
            if (result.err) self.router.sendJson(req, res, null, result.err);

            return self.router.sendJson(
                req, res, resultModifier.storesGetStore(result.data));
        });
    },


    // create store
    createStore: function (req, res) {
        var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.createStore))
            return;

        storeDB.stores_create(b, function (err, result) {
			if (err) return self.router.sendJson(req, res, null, err);

            result = database.resultHandler.getOutputs(["newStoreId", "newPersonId"], result);
            if (result.err) self.router.sendJson(req, res, null, result.err);

            return self.router.sendJson(req, res, result.outputs);
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
            if (err) return self.router.sendJson(req, res, null, err);

            result = database.resultHandler.getOutputs(["newStoreApplicationId"], result);
            if (result.err) self.router.sendJson(req, res, null, result.err);

            // send user verification email
            self.mail.sendStoreApplicationEmail(b.name, b.email, function (err) {
                if (err) console.log(err);
            });

            // TODO : send internal email for new application

            return self.router.sendJson(req, res, result.outputs);
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
        if (errMsg) return self.router.sendJson(req, res, null, { message: errMsg, status: 400 });

        // validate other stuff
        if (this.router.validateInputs(req, res, b, global.validationRules.updateStoreDetails))
            return;

        storeDB.stores_details_update(b, function (err) {
			if (err) return self.router.sendJson(req, res, null, err);

            return self.router.sendJson(req, res);
        });
	},


	// Delete a store
	deleteStore: function (req, res) {
		var b = req.body;
        var self = this;

        if (this.router.validateInputs(req, res, b, global.validationRules.deleteStore))
            return;

        // delete store from db
        storeDB.stores_delete(b, function (err) {
			if (err) return self.router.sendJson(req, res, null, err);

            return self.router.sendJson(req, res, result);
        });
	},


    // upload a store logo
    updateLogo: function (req, res) {
        var self = this;
        var b = req.body;
        var errMsg = null;
        var imageFile = req.file;

        if (this.router.validateInputs(req, res, b, global.validationRules.updateLogo))
            return;

        // check image properties
        if (!imageFile) {
            errMsg = "imageFileMissing";
        } else if (imageFile.mimetype !== "image/jpeg") {
            errMsg = "imageFileWrongType";
        } else if (imageFile.size > 250000) {
            errMsg = "imageFileTooBig";
        } else if (!req.file.buffer) {
            errMsg = "imageDataMissing";
        }

        if (errMsg) {
            return this.router.sendJson(req, res, null, { message: errMsg, status: 400 });
        }

        var imgPath = path.join(config.storeLogos, "store" + b.id_store + ".jpg");

        fs.writeFile(path.join(__dirname, "../", "../", "www", imgPath), req.file.buffer, function (err) {
            if (err) return self.router.sendJson(req, res, null, err);

            return self.router.sendJson(req, res, { url: imgPath });
        });
    },

}