"use strict";

// People api

var mail = require("../other/mail");
var dbApp = require("../database/procedures/_App");
var passportAuth = require("../other/passport-auth");


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

        // hash password and create verification token
        passportAuth.createRegistrationTokens(b.password, function (err, tokens) {
            if (err) return self.router.sendJson(res, null, err.message);

            b.verification_token = tokens.verification;
            b.password = tokens.password;

            // create person in db
            dbApp.people_create(b, function (err, user) {

                if (err) return self.router.sendJson(res, null, err.message, err.status);

                // send user verification email
                mail.sendUserRegistrationEmail(b.first_name, b.email, tokens.verification, function (err) {
                    if (err) return self.router.sendJson(res, null, err.message);

                    return self.router.sendJson(res);
                });

                return self.router.sendJson(res, null, err);
            });
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