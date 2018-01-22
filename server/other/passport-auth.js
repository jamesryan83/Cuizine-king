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
        }, function (jwt, done) { // called if token is found in header
            return done(null, jwt);
        }));


//        // Serialize User
//        passport.serializeUser(function(user, done) {
//            return done(null, user.id_person);
//        });
//
//
//        // Deserialize User
//        passport.deserializeUser(function(id, done) {
//            appDB.people_get_by_id_or_email({ id: id }, function (err, user) {
//                if (err) return done(err);
//
//                return done(null, user);
//            });
//        });
    },



    // authenticate jwt
    authenticate: function (req, res, next) {
        var self = this;

        // handle errors from authenticate()
        function sendErrorResponse(err) {
            if (self.router.isRequestAjax(req)) {
                return self.router.sendJson(res, null, err.message, err.status);
            }

            return res.redirect("/login");
        }

        // check jwt against secret
        passport.authenticate("jwt", { session: false }, function (err, jwTokenObject, info) {
            if (err) return sendErrorResponse(err);

            // TODO : jwt should fail if signature algorithm is set to none

            if (!jwTokenObject) {
                return sendErrorResponse({ message: "Not Authorized", status: 401 });
            }

            // TODO: refresh token on short expiry
//            console.log(jwTokenObject.iat)
//            console.log(jwTokenObject.exp)
            console.log(jwTokenObject)

            // check jwt against database
            var jwToken = self.getJwtFromHeader(req, res);
            appDB.people_get_by_jwt({ jwt: jwToken, email: jwTokenObject.sub }, function (err, person) {
                res.locals.person = null;

                if (err) return sendErrorResponse(err);

                res.locals.person = person;
                return next();
            });

        })(req, res, next);
    },



    // Check the users password
    checkUsersPassword: function (res, email, password, callback) {
        var self = this;

        // get the current user
        appDB.people_get_by_email({ email: email }, function (err, user) {
            if (err) return callback(err);

            // check password
            self.comparePassword(password, user.password, function (err) {
                if (err) return callback(err);

                res.locals.user = user;
                return callback(null);
            });
        });
    },



    // Check the store owners password
    checkStoreOwnersPassword: function (res, email, password, callback) {

        // get the current user
        appDB.people_get_by_email({ email: email }, function (err, user) {
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
        return self.router.sendJson(res, null, "Not Authorized", 401);
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

