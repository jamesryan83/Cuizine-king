"use strict";

// Server side router

var fs = require("fs");
var ejs = require("ejs");
var url = require("url");
var path = require("path");
var multer  = require("multer");
var validate = require("validate.js");
var router = require("express").Router();

var authApi = require("../api/auth");
var peopleApi = require("../api/people");
var storesApi = require("../api/stores");
var locationApi = require("../api/location");
var sysadminApi = require("../api/sysadmin");


var config = require("../config");
var routerCms = require("../../www/js/cms");
var passportAuth = require("./passport-auth");
var routerSite = require("../../www/js/site");
var routerSysadmin = require("../../www/js/sysadmin");


var upload = multer();

var wwwFolder = path.join(__dirname, "../", "../", "www");

// TODO : csrf tokens


exports = module.exports = {

    server: undefined,


    // Setup router
    init: function (expressServer) {
		var self = this;
        this.server = expressServer;

        passportAuth.init(this);

        authApi.init(this);
        locationApi.init(this);
        peopleApi.init(this);
        storesApi.init(this);
        sysadminApi.init(this);

        var authenticate = passportAuth.authenticate.bind(passportAuth);


        // index html files
        this.indexCms = fs.readFileSync(path.join(wwwFolder, "_index-cms.html"), "utf8");
        this.indexSite = fs.readFileSync(path.join(wwwFolder, "_index-site.html"), "utf8");
        this.indexSysadmin = fs.readFileSync(path.join(wwwFolder, "_index-sysadmin.html"), "utf8");
        this.indexError = fs.readFileSync(path.join(wwwFolder, "index-error.html"), "utf8");


        // log the requested route & headers
        router.use(function (req, res, next) {
            if (global.devMode) {
                // Change db when called from tests
                if (req.headers["user-agent"] && req.headers["user-agent"].indexOf("node-superagent") !== -1) {
                    config.mssql.database = "menuthingTest";
                } else {
                    config.mssql.database = "menuthing";
                }
            }

            if (config.logRequestRoute) console.log("requested url: " + req.url);
            if (config.logRequestHeaders) console.log(req.headers);
            next();
        });


        // site, cms and sysadmin pages
        router.get(routerSite.routesList, function (req, res) { self.renderPage(req, res, "site"); });
        router.get(routerCms.routesList, authenticate, function (req, res) { self.renderPage(req, res, "cms"); }); // auth.authenticate,
        router.get(routerSysadmin.routesList, authenticate, function (req, res) { self.renderPage(req, res, "sysadmin"); });


        // api
        router.get( "/api/v1/people", authenticate, peopleApi.get.bind(peopleApi));
        router.get( "/api/v1/store", storesApi.get.bind(storesApi));
        router.get( "/api/v1/location", locationApi.get.bind(locationApi));
        router.post("/api/v1/store-application", storesApi.create.bind(storesApi));


        // auth api
        router.post("/api/v1/login", authApi.login.bind(authApi));
        router.post("/api/v1/store-login", authApi.storeLogin.bind(authApi));
        router.post("/api/v1/register", authApi.createUser.bind(authApi));
        router.get( "/api/v1/logout", authApi.logout.bind(authApi));
        router.post("/api/v1/check-token", authenticate, authApi.checkJwt.bind(authApi)); // returns a new jwt from a user email
        router.post("/api/v1/reset-password", authApi.resetPassword.bind(authApi));
        router.post("/api/v1/forgot-password", authApi.forgotPassword.bind(authApi));
        router.post("/api/v1/verify-account", authApi.verifyAccount.bind(authApi));



        // sysadmin TODO : ip authentication or something
        router.post("/api/sysadmin/stores", storesApi.create.bind(storesApi));
        router.put( "/api/sysadmin/stores", storesApi.update.bind(storesApi));
        router.get( "/api/sysadmin/recreate-database", sysadminApi.recreateDatabase.bind(sysadminApi));


        router.post("/api/v1/upload-logo", upload.single("logo"), storesApi.uploadLogo.bind(storesApi));


        router.use(this.catchAll.bind(this));

        this.server.use("/", router);
    },


    // Validate route inputs.  send error if there's an error
    validateInputs: function (req, res, inputs, validationRule) {
        var err = validate(inputs, validationRule, { format: "flat" });

        if (err && err.length > 0) {
            if (this.isRequestAjax(req)) {
                return this.sendJson(res, null, err[0], 400);
            }

            return this.renderErrorPage(req, res, err, 400);
        }

        return null; // inputs ok
    },


    // Render page
    renderPage: function (req, res, section) {
        var route = url.parse(req.url).pathname;

        if (global.devMode) { // no cache
            this.indexCms = fs.readFileSync(path.join(wwwFolder, "_index-cms.html"), "utf8");
            this.indexSite = fs.readFileSync(path.join(wwwFolder, "_index-site.html"), "utf8");
            this.indexSysadmin = fs.readFileSync(path.join(wwwFolder, "_index-sysadmin.html"), "utf8");
        }

        var currentPage = null;
        if (section === "cms") currentPage = this.indexCms;
        if (section === "site") currentPage = this.indexSite;
        if (section === "sysadmin") currentPage = this.indexSysadmin;

        var pageData = {};
        if (route == "/verify-account") {
            pageData.verification_token = !req.query ? null : req.query.t;
        }

        if (route == "/reset-password") {
            pageData.reset_password_token = !req.query ? null : req.query.t;
        }

        return res.send(ejs.render(currentPage, pageData));
    },


    // send Json response
    sendJson: function (res, data, err, status) {
        if (err) {
            return res.status(status || 500)
                .json({ data: data, err: err || "Server Error" });
        }

        return res.json({ data: data });
    },


    // Returns true if the request is an ajax request
    isRequestAjax: function (req) {
        if (req.xhr) return true;
        if (req.headers["content-type"] && req.headers["content-type"] == "application/json") return true;
        if (req.headers["accept"] && req.headers["accept"].indexOf("text/html") === -1) return true;

        return false;
    },


    // Catch all
    // Returns an error page or json
    catchAll: function (req, res, next) {
        var errorMessage = "Unknown Route";

        if (this.isRequestAjax(req)) {
            return this.sendJson(res, null, errorMessage, 404);
        }

        return this.renderErrorPage(req, res, errorMessage, 404);
    },


    // Render the error page
    renderErrorPage: function (req, res, err, status) {
        var pageData = {
            status: status || 500,
            message: err || "There was an error :`(",
            route: req.url
        }

        if (global.devMode) { // no cache
            this.indexError = fs.readFileSync(path.join(wwwFolder, "index-error.html"), "utf8");
        }

        return res.status(pageData.status).send(ejs.render(this.indexError, pageData));
    },

}
