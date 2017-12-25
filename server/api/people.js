"use strict";

// Users api

var dbApp = require("../database/procedures/_App");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // Create person
    create: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleCreate))
            return;

        b.id_user_doing_update = 1; // system user


        dbApp.people_create(b, function (err, user) {
            return self.router.sendJson(res, null, err);
        });
    },


    // Get person
    get: function (req, res) {
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleGet))
            return;

//        dbApp.get(req.user.id_user )
    },


    // Update person
    update: function (req, res) {
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleUpdate))
            return;
    },


    // Delete person
    delete: function (req, res) {
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleDelete))
            return;
    },


}