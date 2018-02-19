"use strict";

// Auth api route handlers and some functions to create tokens and stuff

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var config = require("../config");
var appDB = require("../procedures/_App");
var passportAuth = require("../other/passport-auth");


exports = module.exports = {

    router: null,

    mail: require("../other/mail"), // is here for testing


    init: function (router) {
        this.router = router;
    },


    // Website login
    websiteLogin: function (req, res) {
        this._login("is_web_user", req, res);
    },


    // Store (CMS) login
    storeLogin: function (req, res) {
        this._login("is_store_user", req, res);
    },


    // System login
    systemLogin: function (req, res) {
        this._login("is_system_user", req, res);
    },


    // Login
    _login: function (accessProperty, req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.login))
            return;

        // check password
        passportAuth.checkUsersPassword(accessProperty, res, b.email, b.password, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // system users aren"t tied to a store id and should update stores using backend stuff
            if (accessProperty == "is_store_user" && res.locals.person.is_system_user) {
                return self.router.sendJson(res, null, "System users can't log into stores", 401);
            }

            // create a jwt and send to user
            self.createJwt(res.locals.person.id_person, function (err2, result) {
                if (err2) return self.router.sendJson(res, null, err2.message, err2.status);

                // add id_store to result if logging into cms
                if (accessProperty == "is_store_user") {
                    result.id_store = res.locals.person.id_store;
                }

                return self.router.sendJson(res, result);
            });
        });
    },



    // Website create user
    websiteCreateUser: function (req, res) {
        this._createUser("people_create_web_user", req, res);
    },


    // Store create user
    storeCreateUser: function (req, res) {
        this._createUser("people_create_store_user", req, res);
    },


    // System create user
    systemCreateUser: function (req, res) {
        this._createUser("people_create_system_user", req, res);
    },



    // Create a user
    _createUser: function (procedure, req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.createUser))
            return;

        // encrypt password
        bcrypt.hash(b.password, 10, function (err, encryptedPassword) {
            if (err) return self.router.sendJson(res, null, "Error creating token", 500);

            // add verification token and password to inputs
            b.verification_token = self.makeid();
            b.password = encryptedPassword;

            if (res.locals.person) {
                b.id_user_doing_update = res.locals.person.id_person;
            } else {
                b.id_user_doing_update = config.dbConstants.adminUsers.system;
            }

            // create person in db
            appDB[procedure](b, function (err2, outputs) {
                if (err2) return self.router.sendJson(res, null, err2.message, err2.status);

                // create a jwt
                self.createJwt(outputs.newPersonId, function (err3, result) {
                    if (err3) return self.router.sendJson(res, null, err3.message, err3.status);

                    // send user verification email
                    if (procedure != "people_create_system_user") {
                        self.mail.sendUserRegistrationEmail(b.first_name, b.email, b.verification_token, function (err4) {
                            if (err4) console.log(err4);
                        });
                    }

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
        passportAuth.checkUsersPassword(null, res, b.email, b.password, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            delete b.password;

            // set persons email as validated
            appDB.people_update_is_verified(b, function (err2) {
                if (err2) return self.router.sendJson(res, null, err2.message, err2.status);

                // send thanks for verifying email
                self.mail.sendThanksForVerifyingEmail(b.email, function (err3) {
                    if (err3) console.log(err3);
                });

                // create a jwt and send to user
                self.createJwt(res.locals.person.id_person, function (err4, result) {
                    if (err4) return self.router.sendJson(res, null, err4.message, err4.status);

                    return self.router.sendJson(res, result);
                });
            });
        });
    },



    // Logout
    logout: function (req, res) {
        var self = this;

        var inputs = { jwt: passportAuth.getJwtFromHeader(req, res) };

        if (this.router.validateInputs(req, res, inputs, global.validationRules.logout))
            return;

        // TODO : security of inputs
        appDB.people_invalidate_jwt(inputs, function (err) {
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
        }, function (err) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // send reset link
            self.mail.sendForgotPasswordEmail(b.email, reset_password_token, function (err2) {
                if (err2) return self.router.sendJson(res, null, err2.message, err2.status);

                return self.router.sendJson(res, {
                    message: "You have been sent an email to reset your password"
                });
            });
        });
    },



    // Reset password
    // used after getting a forgot password email
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
            }, function (err2) {
                if (err2) return self.router.sendJson(res, null, err2.message);

                return self.router.sendJson(res);
            });
        });
    },



    // Checks if a jwt is valid and returns id_person
    checkJwt: function (req, res) {
        if (res.locals.person) {
            var person = res.locals.person;
            var result = { id_person: person.id_person, jwt: person.jwt };

            if (person.id_store && person.id_store > 0) {
                result.id_store = person.id_store;
            }

            return this.router.sendJson(res, result);
        }

        return this.router.sendJson(res, null, "Not Authorized", 401);
    },








    // ------------------- Other functions -------------------



    // create a jwt for a user
    createJwt: function (id_person, callback) {

        jwt.sign({ sub: id_person, shortExp: config.jwtExpiryShort }, config.secret, { expiresIn: config.jwtExpiryLong }, function (err, jwToken) {
            if (err) return callback(err);

            // update jwt in db
            appDB.people_update_jwt({ id_person: id_person, jwt: jwToken }, function (err2, person) {
                if (err2) return callback(err2);

                var result = { jwt: jwToken, id_person: person.id_person };

                return callback(null, result);
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
