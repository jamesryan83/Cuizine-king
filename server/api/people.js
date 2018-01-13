"use strict";

// People api

var jwt = require('jsonwebtoken');

var auth = require("./auth");
var config = require("../config");
var mail = require("../other/mail");
var dbApp = require("../procedures/_App");
var passportAuth = require("../other/passport-auth");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // Get person
    get: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleCreate))
            return;

        dbApp.people_get(b, function (err, person) {
            if (err) return self.router.sendJson(res, null, err.message);

            return self.router.sendJson(res, { person: person });
        });
    },



    // Create person
    create: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleCreate))
            return;

        b.id_user_doing_update = 1; // system user

        // hash password and create verification token
        auth.createRegistrationTokens(b.password, function (err, tokens) {
            if (err) return self.router.sendJson(res, null, err.message);

            var originalPassword = b.password;
            b.verification_token = tokens.verification;
            b.password = tokens.password;

            // create jwt for user
            jwt.sign({ email: req.body.email }, config.secret, { expiresIn: config.jwtExpiry }, function (err, jwToken) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                b.jwt = jwToken;

                // create person in db
                dbApp.people_create(b, function (err) {
                    if (err) return self.router.sendJson(res, null, err.message, err.status);

                    // send user verification email
                    mail.sendUserRegistrationEmail(b.first_name, b.email, tokens.verification, function (err) {
                        if (err) return self.router.sendJson(res, null, err.message);

                        req.body.password = originalPassword;

                        // login
                        passportAuth.authenticate(req, res, function (err) {
                            if (err) return self.router.sendJson(res, null, err.message, err.status);

                            return self.router.sendJson(res, { jwt: jwToken });
                        });
                    });
                });
            });
        });
    },



    // verify persons email
    verifyEmail: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.verifyAccount))
            return;

        // check persons password
        passportAuth.checkUsersPassword(b.email, b.password, function (err, user) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // set persons email as validated
            dbApp.people_validate_email(b, function (err) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                return self.router.sendJson(res, null);
            });
        });
    },


}