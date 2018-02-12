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

var routerCms = require("../../www/js/cms");
var routerSite = require("../../www/js/site");
var routerSysadmin = require("../../www/js/sysadmin");

var config = require("../config");
var passportAuth = require("./passport-auth");

var wwwFolder = path.join(__dirname, "../", "../", "www");


exports = module.exports = {

    server: undefined,


    // Setup router
    init: function (expressServer) {
        this.server = expressServer;

        this.reloadFilesSync();

        var upload = multer();


        // auth middleware
        passportAuth.init(this);
        var authenticate = passportAuth.authenticate.bind(passportAuth);
        var authenticateStore = passportAuth.authenticateStore.bind(passportAuth);
        var authenticateSystem = passportAuth.authenticateSystem.bind(passportAuth);


        authApi.init(this);
        locationApi.init(this);
        peopleApi.init(this);
        storesApi.init(this);
        sysadminApi.init(this);


        // create available routes array
        var availableRoutes = routerSite.routesList
            .concat(routerCms.routesList)
            .concat(routerSysadmin.routesList);


        // log the requested route & headers
        router.use(this.beforeRequest.bind(this));


        // handle page requests
        router.get(availableRoutes, this.handlePrimaryPageRequest.bind(this));


        // handles second part of page requests
        router.post("/page-request", this.handleSecondaryPageRequest.bind(this));


        // api
        router.get( "/api/v1/location", locationApi.getLocation.bind(locationApi));
        router.get( "/api/v1/store", storesApi.getStore.bind(storesApi));
        router.post("/api/v1/store-application", storesApi.createStoreApplication.bind(storesApi));
        router.post("/api/v1/store-update-logo", authenticateStore, upload.single("logo"), storesApi.updateLogo.bind(storesApi));
        router.get( "/api/v1/account", authenticate, peopleApi.getPerson.bind(peopleApi))
        router.get( "/api/v1/delete-user", authenticate, peopleApi.deletePerson.bind(peopleApi));


        // auth api
        router.post("/api/v1/login", authApi.websiteLogin.bind(authApi));
        router.post("/api/v1/store-login", authApi.storeLogin.bind(authApi));
        router.post("/api/v1/create-user", authApi.websiteCreateUser.bind(authApi));
        router.post("/api/v1/reset-password", authApi.resetPassword.bind(authApi)); // TODO : authenticate ?
        router.post("/api/v1/forgot-password", authApi.forgotPassword.bind(authApi));
        router.post("/api/v1/verify-account", authApi.verifyAccount.bind(authApi));
        router.get( "/api/v1/logout", authenticate, authApi.logout.bind(authApi));
        router.post("/api/v1/check-token", authenticate, authApi.checkJwt.bind(authApi)); // returns a new jwt from a user email
        router.post("/api/v1/create-store-user", authenticateStore, authApi.storeCreateUser.bind(authApi));


        // sysadmin
        router.get( "/admin-login", this.sysadminLoginPage.bind(this));
        router.post("/api/v1/admin-login", authApi.systemLogin.bind(authApi));
        router.post("/api/sysadmin/create-store", authenticateSystem, storesApi.createStore.bind(storesApi));
        router.post("/api/sysadmin/create-system-user", authenticateSystem, authApi.systemCreateUser.bind(authApi));



        // catch all
        router.use(this.catchAll.bind(this));

        this.server.use("/", router);
    },



    // Runs before evrey request
    beforeRequest: function (req, res, next) {
        if (global.devMode) {
            // Change db when called from tests
            if (req.headers["user-agent"] && req.headers["user-agent"].indexOf("node-superagent") !== -1) {
                config.mssql.database = "menuthingTest";
            } else {
                config.mssql.database = "menuthing";
            }

            this.reloadFilesSync();
        }

        if (config.logRequestRoute) console.log("requested url: " + req.url);
        if (config.logRequestHeaders) console.log(req.headers);

        next();
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



    // Handles the initial request for a page
    // Returns small html page that makes an request with a jwt
    handlePrimaryPageRequest: function (req, res) {
        if (global.devMode) { // no cache
            this.reloadFilesSync();
        }

        return res.send(this.files.indexMain);
    },



    // Handles the second part of a reqest for a page
    // The response is the content for the page
    handleSecondaryPageRequest: function (req, res) {
        var self = this;
        var jwt = req.headers["authorization"];
        var route = decodeURI(req.body.encodedUrl);


        // Remove user specific numbers and stuff from route
        var normalized = routerCms.normalizeRoute(route);
        if (!normalized.match) {
            normalized = routerSite.normalizeRoute(route);
        }


        var routeData = {};

        // site
        if (routerSite.routes[normalized.route]) {
            return res.send({
                section: "site",
                html: self.files.siteHtml,
                css: "/generated/_site.css",
                js: "/generated/_site.js"
            });

        // cms
        } else if (routerCms.routes[normalized.route]) {
            passportAuth.authenticateStore(req, res, function () {
                return res.send({
                    section: "cms",
                    html: self.files.cmsHtml,
                    css: "/generated/_cms.css",
                    js: "/generated/_cms.js",
                    jwt: res.locals.person.jwt
                });
            });

        // system admin
        } else if (routerSysadmin.routes[normalized.route]) {
            passportAuth.authenticateSystem(req, res, function () {
                return res.send({
                    section: "sysadmin",
                    html: self.files.sysadminHtml,
                    css: "/generated/_sysadmin.css",
                    js: "/generated/_sysadmin.js",
                    jwt: res.locals.person.jwt
                });
            });
        }
    },



//    // Render page
//    renderPage: function (req, res, section) {
//        var route = url.parse(req.url).pathname;
//
//
//        var pageData = { section: section };
//        if (route == "/verify-account") {
//            pageData.verification_token = !req.query ? null : req.query.t;
//        }
//
//        if (route == "/reset-password") {
//            pageData.reset_password_token = !req.query ? null : req.query.t;
//        }
//
////        return res.send(ejs.render(currentPage, pageData));
//        var tempIndex = fs.readFileSync(path.join(wwwFolder, "index-main.html"), "utf8");
//        return res.send(ejs.render(tempIndex, pageData));
//    },



    // System admin login page
    sysadminLoginPage: function (req, res) {
        if (global.devMode) { // no cache
            this.reloadFilesSync();
        }

        return res.send(this.files.indexAdmin);
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
    catchAll: function (req, res) {
        var errorMessage = "Unknown Route";
        console.log(errorMessage + " " + req.url);

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
            this.reloadFilesSync();
        }

        return res.status(pageData.status).send(ejs.render(this.files.indexError, pageData));
    },


    // reload all the static files
    reloadFilesSync: function () {
        this.files = {};
        var genFolder = path.join(wwwFolder, "generated");

        this.files.indexMain = fs.readFileSync(path.join(wwwFolder, "index-main.html"), "utf8");
        this.files.indexError = fs.readFileSync(path.join(wwwFolder, "index-error.html"), "utf8");
        this.files.indexAdmin = fs.readFileSync(path.join(wwwFolder, "index-admin.html"), "utf8");

        this.files.siteHtml = fs.readFileSync(path.join(genFolder, "_site.json"), "utf8");
        this.files.cmsHtml = fs.readFileSync(path.join(genFolder, "_cms.json"), "utf8");
        this.files.sysadminHtml = fs.readFileSync(path.join(genFolder, "_sysadmin.json"), "utf8");
    },

}

