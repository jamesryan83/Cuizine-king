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
    login: function (req, res, next) {
        var self = this;

        if (this.router.validateInputs(req, res, req.body, global.validationRules.login))
            return;

        passportAuth.authenticate(req, res, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // create jwt for user
            jwt.sign({ email: req.body.email }, config.secret, { expiresIn: config.jwtExpiry }, function (err, jwToken) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                return self.router.sendJson(res, { jwt: jwToken });
            });
        });
    },



    // Logout
    logout: function (req, res) {
        var self = this;

        req.session.destroy(function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            if (req.user) console.log("Warning : #logout - user should be null but is " + req.user + ". session: " + req.session);

            return self.router.sendJson(res);
        });
    },



    // Send the user registration email for a pending user
    sendRegistrationEmail: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.sendRegistrationEmail))
            return;

        // TODO : throttle

        appDB.get_person({ email: b.email }, function (err, user) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            if (user.id_person) return self.router.sendJson(res, null, "Account already verified", 400);

            // send user validation email
            mail.sendUserRegistrationEmail(user.first_name, b.email, user.verification_token, function (err) {
                if (err) return self.router.sendJson(res, null, err.message);

                return self.router.sendJson(res);
            });
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

        // find user in actual users table
        appDB.people_get({ email: b.email }, function (err, user) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            if (!user.id_person) return self.router.sendJson(res, null, "Please verify your account", 401);

            // create token -- TODO : needs stored proc
            var token = self.makeid();
            var query = "UPDATE users SET reset_password_token = '" +
                token + "' WHERE email = '" + b.email + "'";

            // TODO : don't do this, wait for result
            // add token to database without waiting for response
            database.executeQuery(query, function (err) {
                if (err) console.log(err);
            });

            // send reset link
            mail.sendForgotPasswordEmail(user.email, token, function (err) {
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
            appDB.update_reset_password_token({
                password: encryptedPassword,
                reset_password_token: b.token
            }, function (err) {
                if (err) return self.router.sendJson(res, null, err.message);

                // TODO : login here

                return self.router.sendJson(res);
            });
        });
    },



    // ------------------- create tokens -------------------


    // Create all tokens required for registration
    createRegistrationTokens: function (password, callback) {

        var verificationToken = this.makeid(); // value is also in validation-routes.js and sql

        // encrypt password
        bcrypt.hash(password, 10, function (err, encryptedPassword) {
            if (err) return callback(err);

            return callback(null, {
                password: encryptedPassword,
                verification: verificationToken
            });
        });
    },


    // Create a random alphanumeric string
    // https://stackoverflow.com/a/1349426
    makeid: function () {
        var tokenLength = 50;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < tokenLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },



    // Create a jwt for a user
    createJwt: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.login))
            return;

        // TODO : this is duplicated above
        // check password
        passportAuth.checkUsersPassword(b.email, b.password, function (err, user) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // make jwt
            jwt.sign({ email: b.email }, config.secret, { expiresIn: config.jwtExpiry }, function (err, jwToken) {
                if (err) return self.router.sendJson(res, null, err.message, err.status);

                // send jwt back
                return self.router.sendJson(res, { jwt: jwToken });
            });

        });
    },

}
