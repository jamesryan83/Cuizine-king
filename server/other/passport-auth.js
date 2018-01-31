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


    // Checks jwt and gets person from database
    authenticate: function (req, res, next) {
        var self = this;

        // Returns an error response if there's an error during authentication
        function sendErrorResponse(err) {
            if (self.router.isRequestAjax(req)) {
                return self.router.sendJson(res, null, err.message, err.status);
            }
            return res.redirect("/login");
        }


        // check jwt against secret
        passport.authenticate("jwt", function (err, jwTokenObject, errInfo) {
            if (err) return sendErrorResponse(err);

            // check if jwt has expired
            if (errInfo) {
                if (errInfo.name == "TokenExpiredError") {
                    return sendErrorResponse({ message: "Token has expired", status: 401 });
                } else {
                    console.log("Unknown jwt errInfo occured", errInfo);
                    jwTokenObject = null;
                }
            }

            // invalid or missing jwt
            if (!jwTokenObject) return sendErrorResponse({ message: "Not Authorized", status: 401 });

            // check jwt short expiry
            console.log(jwTokenObject)
            var d = Date.now() / 1000;
            var shortExp = jwTokenObject.shortExp * 1000;
            console.log(d)
            console.log("iat: " + (jwTokenObject.iat - d))
            console.log("short expiry shortExp: " + (jwTokenObject.shortExp - d))
            console.log("long expiry exp: " + (jwTokenObject.exp - d))

            // TODO : jwt should fail if signature algorithm is set to none

            // TODO: refresh token on short expiry
//            console.log(jwTokenObject.iat) // created
//            console.log(jwTokenObject.exp) // expiry
//            console.log(jwTokenObject.sub) // email

            var jwt = self.getJwtFromHeader(req, res);

            // get person from database by their jwt and email
            appDB.people_get_by_jwt({
                jwt: jwt,
                email: jwTokenObject.sub
            }, function (err, person) {
                res.locals.person = null;

                if (err) return sendErrorResponse(err);

                // TODO: check id_person_type agains requested resource

                // save person to the response for other functions
                res.locals.person = person;

                return next();
            });
        })(req, res, next);
    },



    // ----------------------- Other functions -----------------------



    // Check the users password
    checkUsersPassword: function (res, email, password, id_person_type, callback) {
        var self = this;

        // get the current user
        appDB.people_get_by_email({ email: email, id_person_type: id_person_type }, function (err, user) {
            if (err) return callback(err);

            // check password
            self.comparePassword(password, user.password, function (err) {
                if (err) return callback(err);

                res.locals.user = user;
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

