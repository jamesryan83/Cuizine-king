"use strict";

// Auth api route handlers and some functions to create tokens and stuff

var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

var config = require("../config");
var mail = require("../other/mail");
var database = require("../database/database");
var passportAuth = require("../other/passport-auth");

var appDB = require("../procedures/_App");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },



    // Login
    login: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.login))
            return;

        // check password
        passportAuth.checkUsersPassword(res, b.email, b.password, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // create a jwt and send to user
            self.createJwt(b.email, function (err, result) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                return self.router.sendJson(res, result);
            });
        });
    },



    // Store Login
    storeLogin: function (req, res) {
        var self = this;

        if (this.router.validateInputs(req, res, req.body, global.validationRules.storeLogin))
            return;
    },



    // Register a user
    createUser: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.createUser))
            return;

        b.id_user_doing_update = 1; // system user

        // encrypt password
        bcrypt.hash(b.password, 10, function (err, encryptedPassword) {
            if (err) return self.router.sendJson(res, null, "Error creating token", 500);

            b.verification_token = self.makeid(); // create verification token
            b.password = encryptedPassword;

            // create person in db
            appDB.people_create_web_user(b, function (err, newPersonId) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                // create a jwt and send to user
                self.createJwt(b.email, function (err, result) {
                    if (err) return self.router.sendJson(res, null, err.message, err.status);

                    // send user verification email
                    mail.sendUserRegistrationEmail(b.first_name, b.email, b.verification_token, function (err) {
                        if (err) console.log(err);
                    });

                    return self.router.sendJson(res, result);
                });
            });
        });
    },



    // verify users email
    verifyAccount: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.verifyAccount))
            return;

        // check persons password
        passportAuth.checkUsersPassword(res, b.email, b.password, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            delete b.password;

            // set persons email as validated
            appDB.people_update_is_verified(b, function (err) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                // send thanks for verifying email
                mail.sendThanksForVerifyingEmail(b.email, function (err) {
                    if (err) console.log(err);
                });

                return self.router.sendJson(res, null);
            });
        });
    },



    // Logout
    logout: function (req, res) {
        var self = this;

        var inputs = { jwt: passportAuth.getJwtFromHeader(req, res) };

        if (this.router.validateInputs(req, res, inputs, global.validationRules.logout))
            return;

        appDB.people_invalidate_jwt(inputs, function (err, rowsAffected) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res);
        });
    },



    // Registered and verified - send reset link
    // Registered not verified - need to verify message
    // Neither - account not found
    forgotPassword: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.forgotPassword))
            return;

        var reset_password_token = self.makeid();

        appDB.people_update_reset_password_token({
            email: b.email,
            reset_password_token: reset_password_token
        }, function (err, id_person) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // send reset link
            mail.sendForgotPasswordEmail(b.email, reset_password_token, function (err) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                return self.router.sendJson(res, {
                    message: "You have been sent an email to reset your password"
                });
            });
        });
    },



    // Reset password
    resetPassword: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.resetPassword))
            return;

        // encrypt password
        bcrypt.hash(b.password, 10, function (err, encryptedPassword) {
            if (err) return self.router.sendJson(res, null, err.message);

            // add password to database
            appDB.people_update_password({
                email: b.email,
                password: encryptedPassword,
                reset_password_token: b.reset_password_token
            }, function (err) {
                if (err) return self.router.sendJson(res, null, err.message);

                return self.router.sendJson(res);
            });
        });
    },



    // Checks if a jwt is valid and returns id_person
    checkJwt: function (req, res) {
        if (res.locals.person) {
            var person = res.locals.person;
            return this.router.sendJson(res, { id_person: person.id_person, jwt: person.jwt });
        }

        return this.router.sendJson(res, null, "Not Authorized", 401);
    },








    // ------------------- Other functions -------------------



    // create a jwt for a user
    createJwt: function (email, callback) {

        // create jwt for user
        jwt.sign({ sub: email }, config.secret, { expiresIn: config.jwtExpiryLong }, function (err, jwToken) {
            if (err) return callback(err);

            // update jwt in db
            appDB.people_update_jwt({ email: email, jwt: jwToken }, function (err, id_person) {
                if (err) return callback(err);

                return callback(null, { jwt: jwToken, id_person: id_person });
            });
        });
    },


    // Create a random alphanumeric string
    // https://stackoverflow.com/a/1349426
    makeid: function () {
        var tokenLength = 64;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < tokenLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },


}
