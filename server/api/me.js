"use strict";

// Current user api

var dbApp = require("../procedures/_App");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // Get currently logged in user
    get: function (req, res) {
        var self = this;
        var inputs = { email: req.user.email };

        if (this.router.validateInputs(req, res, inputs, global.validationRules.apiMeGet))
            return;

        dbApp.get_person(inputs, function (err, user) {
            return self.router.sendJson(res, user);
        });
    },


    // Update currently logged in user
    update: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.apiMeUpdate))
            return;

        // email is overriden if it's provided
        // Authorized user email is required for update
        b.email = req.user.email;
        b.id_person = -1;

        dbApp.update_person(b, function (err) {
            return self.router.sendJson(res, null, err);
        });
    },


    // Delete currently logged in user
    delete: function (req, res) {
        var self = this;
        var inputs = { email: req.user.email };

        if (this.router.validateInputs(req, res, inputs, global.validationRules.apiMeDelete))
            return;

        dbApp.delete_person({ email: inputs.email }, function (err) {
            return self.router.sendJson(res, null, err);
        });
    },


}