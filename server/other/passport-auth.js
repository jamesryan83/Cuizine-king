"use strict";

// Passport strategies
// good example vid: https://www.youtube.com/watch?v=twav6O53zIQ
// multiple strategies example: https://gist.github.com/joshbirk/1732068

var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var LocalStrategy = require("passport-local").Strategy;

var config = require("../config");
var appDB = require("../database/procedures/_App");


exports = module.exports = {

    router: null,


    // Setup
    init: function (router) {
        var self = this;
        this.router = router;

        // this is run whenever passport.authenticate("local" is called
        // local session auth
        passport.use(new LocalStrategy({
            usernameField: "email"
        }, function (email, password, done) {

            // get user from database
            self.checkUsersPassword(email, password, function (err, user) {
                if (err) return done(err);
                return done(null, user);
            });
        }));


        // this is run whenever passport.authenticate("jwt" is called
        // api jwt auth
        passport.use(new JwtStrategy({
            secretOrKey: config.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        }, function (jwt, done) { // called if token is found in cookie
            return done(null, jwt);
        }));


        // Serialize User
        passport.serializeUser(function(user, done) {
            return done(null, user.id_user || user.id_pending_user);
        });


        // Deserialize User
        passport.deserializeUser(function(id, done) {
            appDB.people_get({ id: id }, function (err, user) {
                if (err) return done(err);

                return done(null, user);
            });
        });
    },



    // for website page routes
    // called from #login in auth api
    authenticate: function (req, res, next) {
        var self = this;
        if (req.isAuthenticated()) return next(); // continue if already authenticated

        passport.authenticate("local", function (err, user) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            // returnTo is also added to the user session here
            // https://github.com/jaredhanson/connect-ensure-login
            if (!user) return res.redirect("/login");

            // this triggers passport.serializeUser
            req.logIn(user, function (err) {
                if (err) {
                    return next({ msg: "Server Error", status: 500 });
                }

                return next();
            });

        })(req, res, next);
    },



    // for api routes
    authenticateApi: function (req, res, next) {
        var self = this;

        passport.authenticate("jwt", { session: false }, function (err, token) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            if (token) {
                req.user = req.user || {};
                req.user.email = token.email; // add users email to current request object

                return next();
            }

            return self.router.sendJson(res, null, "Not Authorized", 401);
        })(req, res, next);
    },



    // Check the users password
    // this is called in verifyAccountAndLogin and from new LocalStrategy above
    checkUsersPassword: function (email, password, allowPendingUsers, callback) {
        if (!callback) {
            callback = allowPendingUsers;
            allowPendingUsers = false;
        }

        appDB.people_get({ email: email }, function (err, user) {
            if (err) return callback(err);

            // user must be in actual table to login
            if (!allowPendingUsers && !user.id_user) {
                return callback({ status: 401, message: "Please verify your account" });
            }

            // check if the password is correct
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) console.log(err)

                if (!res) return callback({ status: 401, message: "Invalid Credentials" });

                return callback(null, user); // pasword ok
            });
        });
    },



    // Logout
    logout: function (req, res, router) {
        // https://stackoverflow.com/a/19132999
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                return router.renderErrorPage(req, res, { status: 500, message: "Error logging out" });
            }

            // note: the user is still logged in at this point.  in rederPage of the
            // redirect they'll be logged out though, so looks ok

            return res.redirect("/login");
        });
    },

}

