"use strict";

// Passport strategies
// good example vid: https://www.youtube.com/watch?v=twav6O53zIQ
// multiple strategies example: https://gist.github.com/joshbirk/1732068

var bcrypt = require("bcryptjs");
var passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var config = require("../config");
var appDB = require("../procedures/_App");
var database = require("../database/database");


exports = module.exports = {

    router: null,


    // Setup
    init: function (router) {
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
                return self.router.sendJson(req, res, null, err);
            }
            return res.redirect("/login");
        }


        // TODO : this whole thing needs to be gooder
        // check jwt against secret
        passport.authenticate("jwt", { session: false }, function (err, jwTokenObject, errInfo) {
            if (err) return sendErrorResponse(err);

            var jwtObj = jwTokenObject;

            // check if jwt has expired
            if (errInfo) {
                if (errInfo.name == "TokenExpiredError") {
                    return sendErrorResponse({ message: "tokenExpired", status: 401 });
                } else {
                    if (errInfo.message == "jwt malformed") {
                        console.log("Error: Malformed jwt");
                    } else if (errInfo.message == "invalid token") {
                        console.log("Error: Invalid token");
                    } else if (errInfo.message == "invalid signature") {
                        console.log("Error: Invalid secret");
                    } else {
                        console.log(errInfo);
                    }
                    jwtObj = null;
                }
            }


            // invalid or missing jwt
            if (!jwtObj) return sendErrorResponse({ message: "notAuthorized", status: 401 });

            // check jwt short expiry

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
            appDB.people_get_by_jwt({ jwt: jwt, id_person: jwtObj.sub }, function (err, result) {
                res.locals.person = null;
                if (err) return sendErrorResponse(err);

                result = database.resultHandler.getData(result, 400, "accountNotFound");
                if (result.err) return callback(result.err);

                var person = result.data;

                // TODO : make this great
                if (!person.is_system_user && !person.is_store_user && section === "store") {
                    return sendErrorResponse({ message: "notAuthorized", status: 401 });
                } else if (!person.is_system_user && section === "system") {
                    return sendErrorResponse({ message: "notAuthorized", status: 401 });
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
    checkUsersPassword: function (req, res, accessProperty, email, password, callback) {
        var self = this;

        // get the current user
        appDB.people_get_by_email({
            email: email, alsoGetStoreInfo: (accessProperty === "is_store_user")
        }, function (err, result) {
            if (err) return callback(err);

            result = database.resultHandler.getData(result, 400, "accountNotFound");
            if (result.err) return callback(result.err);

            var person = result.data;

            // check access
            if (accessProperty) {
                var hasAccess = person[accessProperty];
                if (!hasAccess) {
                    return callback({ message: "notAuthorized", status: 401 });
                }
            }

            // check password
            self.comparePassword(req, password, person.password, function (err) {
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
        return this.router.sendJson(req, res, null, {
            message: "notAuthorized", status: 401 });
    },


    // TODO : why's this out here
    // check if the password is correct
    comparePassword: function (req, password, hashedPassword, callback) {
        bcrypt.compare(password, hashedPassword, function (err, isValid) {
            if (err) console.log(err)

            if (!isValid) return callback({ status: 401, message: "invalidateCredentials" });

            return callback(null); // password ok
        });
    },


}

