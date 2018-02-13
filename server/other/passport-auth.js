"use strict";

// Passport strategies
// good example vid: https://www.youtube.com/watch?v=twav6O53zIQ
// multiple strategies example: https://gist.github.com/joshbirk/1732068

var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var config = require("../config");
var appDB = require("../procedures/_App");


exports = module.exports = {

    router: null,


    // Setup
    init: function (router) {
        var self = this;
        this.router = router;


        // this is run whenever passport.authenticate("jwt" is called
        passport.use(new JwtStrategy({ // this calls jwt.verify(
            secretOrKey: config.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, function (jwTokenObject, done) { // called if token is found in header
            return done(null, jwTokenObject);
        }));
    },



    authenticate: function (req, res, next) {
        this._authenticate("web", req, res, next);
    },

    authenticateStore: function (req, res, next) {
        this._authenticate("store", req, res, next);
    },

    authenticateSystem: function (req, res, next) {
        this._authenticate("system", req, res, next);
    },


    // Checks jwt and gets person from database
    _authenticate: function (section, req, res, next) {
        var self = this;


        // Returns an error response if there's an error during authentication
        function sendErrorResponse(err) {
            if (self.router.isRequestAjax(req)) {
                return self.router.sendJson(res, null, err.message, err.status);
            }
            return res.redirect("/login");
        }


        // check jwt against secret
        passport.authenticate("jwt", { session: false }, function (err, jwTokenObject, errInfo) {
            if (err) return sendErrorResponse(err);

            // check if jwt has expired
            if (errInfo) {
                if (errInfo.name == "TokenExpiredError") {
                    return sendErrorResponse({ message: "Token has expired", status: 401 });
                } else {
                    if (errInfo.message == "jwt malformed") {
                        console.log("Error: Malformed jwt");
                    } else if (errInfo.message == "invalid token") {
                        console.log("Error: Invalid token");
                    } else {
                        console.log("Unknown jwt errInfo occured", errInfo);
                    }
                    jwTokenObject = null;
                }
            }


            // invalid or missing jwt
            if (!jwTokenObject) return sendErrorResponse({ message: "Not Authorized", status: 401 });

            // check jwt short expiry
//            console.log(jwTokenObject);
//            var d = Date.now() / 1000;
//            var shortExp = jwTokenObject.shortExp * 1000;
//            console.log(d);
//            console.log("iat: " + (jwTokenObject.iat - d));
//            console.log("short expiry shortExp: " + (jwTokenObject.shortExp - d));
//            console.log("long expiry exp: " + (jwTokenObject.exp - d));

            // TODO : jwt should also fail if signature algorithm is set to none

            // TODO: refresh token on short expiry
//            console.log(jwTokenObject.iat) // created
//            console.log(jwTokenObject.exp) // expiry
//            console.log(jwTokenObject.sub) // email

            var jwt = self.getJwtFromHeader(req, res);

            // get person from database by their jwt
            appDB.people_get_by_jwt({ jwt: jwt, id_person: jwTokenObject.sub }, function (err, person) {
                res.locals.person = null;
                if (err) return sendErrorResponse(err);

                if (!person.is_system_user && !person.is_store_user && section === "store") {
                    return sendErrorResponse({ message: "Not Authorized", status: 401 });
                } else if (!person.is_system_user && section === "system") {
                    return sendErrorResponse({ message: "Not Authorized", status: 401 });
                } else {
                    res.locals.person = person;
                    return next();
                }
            });
        })(req, res, next);
    },



    // ----------------------- Other functions -----------------------



    // Check the users password
    // accessProperty = is_web_user, is_store_user or is_system_user
    checkUsersPassword: function (accessProperty, res, email, password, callback) {
        var self = this;

        // get the current user
        appDB.people_get_by_email({
            email: email, alsoGetStoreInfo: (accessProperty === "is_store_user")
        }, function (err, person) {
            if (err) return callback(err);

            // check access
            if (accessProperty) {
                var hasAccess = person[accessProperty];
                if (!hasAccess) {
                    return callback({ message: "Not Authorized", status: 401 });
                }
            }

            // check password
            self.comparePassword(password, person.password, function (err) {
                if (err) return callback(err);

                res.locals.person = person;
                return callback(null);
            });
        });
    },


    // Returns a jwt from http header
    getJwtFromHeader: function (req, res) {
        var token = req.headers["authorization"];
        if (token) {
            return token.replace("Bearer ", "");
        }

        // token missing
        return this.router.sendJson(res, null, "Not Authorized", 401);
    },


    // check if the password is correct
    comparePassword: function (password, hashedPassword, callback) {
        bcrypt.compare(password, hashedPassword, function (err, isValid) {
            if (err) console.log(err)

            if (!isValid) return callback({ status: 401, message: "Invalid Credentials" });

            return callback(null); // password ok
        });
    },


}

