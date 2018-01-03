"use strict";

// Server side router

var fs = require("fs");
var ejs = require("ejs");
var url = require("url");
var path = require("path");
var validate = require("validate.js");
var router = require("express").Router();

var routerData = require("./router-data");

var meApi = require("../api/me");
var authApi = require("../api/auth");
var peopleApi = require("../api/people");
var storesApi = require("../api/stores");
var locationApi = require("../api/location");
var sysadminApi = require("../api/sysadmin");


var config = require("../config");
var passportAuth = require("./passport-auth");
var clientRouter = require("../../www/js/shared/client-router");



// TODO : csrf tokens


exports = module.exports = {

    server: undefined,

    websiteIndexFile: "",
    websiteIndexFilePath: "",
    websiteErrorFile: "",
    websiteErrorFilePath: "",


    // Setup router
    init: function (expressServer) {
		var self = this;
        this.server = expressServer;

        routerData.init(this);
        passportAuth.init(this);

        meApi.init(this);
        authApi.init(this);
        locationApi.init(this);
        peopleApi.init(this);
        storesApi.init(this);
        sysadminApi.init(this);


        this.websiteIndexFilePath = path.join(__dirname, "../", "../", "www", "index-website.html");
        this.websiteErrorFilePath = path.join(__dirname, "../", "../", "www", "html", "error.html");


        // cache index-website.html and error.html
        if (!global.devMode) {
            this.websiteIndexFile = fs.readFileSync(this.websiteIndexFilePath, "utf8");
            this.websiteErrorFile = fs.readFileSync(this.websiteErrorFilePath, "utf8");
        }


        // log the requested route
        if (config.logRequestRoute) {
            router.use(function (req, res, next) {
                console.log("requested url: " + req.url);
                next();
            });
        }


        // log the request headers
        if (config.logRequestHeaders)  {
            router.use(function (req, res, next) {
                console.log(req.headers);
                next();
            });
        }


        // logged in pages // passportAuth.authenticate
        router.get(clientRouter.loggedInRoutesList, this.renderPage.bind(this));


        // logged out pages
        router.get(clientRouter.loggedOutRoutesList, this.renderPage.bind(this));


        // api
        var authenticateApi = passportAuth.authenticateApi.bind(passportAuth);
        router.get(   "/api/v1/me",     authenticateApi, meApi.get.bind(meApi)); // me is currently logged in user
        router.put(   "/api/v1/me",     authenticateApi, meApi.update.bind(meApi));
        router.delete("/api/v1/me",     authenticateApi, meApi.delete.bind(meApi));
        router.get(   "/api/v1/people", authenticateApi, peopleApi.get.bind(peopleApi));
        router.put(   "/api/v1/people", authenticateApi, peopleApi.update.bind(peopleApi));
        router.delete("/api/v1/people", authenticateApi, peopleApi.delete.bind(peopleApi));
        router.get(   "/api/v1/stores", authenticateApi, storesApi.get.bind(storesApi));

        router.get("/api/v1/location", locationApi.get.bind(locationApi));


        // auth api
        router.post("/api/v1/login", authApi.login.bind(authApi));
        router.get("/api/v1/logout", authApi.logout.bind(authApi));
        router.post("/api/v1/register", peopleApi.create.bind(peopleApi));
        router.post("/api/v1/register-store", storesApi.create.bind(storesApi));
        router.post("/api/v1/token", authApi.createJwt.bind(authApi)); // returns a new jwt from a user email
        router.post("/api/v1/reset-password", authApi.resetPassword.bind(authApi));
        router.post("/api/v1/forgot-password", authApi.forgotPassword.bind(authApi));
        router.post("/api/v1/verify-account", authApi.verifyAccountAndLogin.bind(authApi));
        router.post("/api/v1/registration-email", authApi.sendRegistrationEmail.bind(authApi));


        // sysadmin TODO : ip authentication or something
        router.post("/api/sysadmin/stores", storesApi.create.bind(storesApi));
        router.put( "/api/sysadmin/stores", storesApi.update.bind(storesApi));
        router.get( "/api/sysadmin/recreate-database", sysadminApi.recreateDatabase.bind(sysadminApi));


        router.use(this.catchAll.bind(this));

        this.server.use("/", router);
    },



    // Catch all
    // Returns an error page or json
    catchAll: function (req, res, next) {
        var errorMessage = "Unknown Route";

        if (this.isRequestAjax(req)) {
            return this.sendJson(res, null, errorMessage, 404);
        }

        return this.redirectToErrorPage(req, res, 404, errorMessage, req.url);
    },



    // Validate route inputs.  send error if there's an error
    validateInputs: function (req, res, inputs, validationRule) {
        var err = validate(inputs, validationRule, { format: "flat" });

        if (err && err.length > 0) {
            if (this.isRequestAjax(req)) {
                return this.sendJson(res, null, err[0], 400);
            }

            return this.renderErrorPage(req, res, { status: 400, message: err[0] });
        }

        return null; // inputs ok
    },



    // Render a page
    renderPage: function (req, res) {
        var route = url.parse(req.url).pathname;

        if (route == "/logout") {
            return passportAuth.logout(req, res, this);
        }

        if (route == "/error") {
            return this.renderErrorPage(req, res, {});
        }



        // TODO : these should be handled elsewhere
        if (route.indexOf("\/store\/") !== -1) {
            if (!req.params || !req.params.id) {
                return this.redirectToErrorPage(
                    req, res, 400, "Store id missing", route);
            }

            route = "/store/:id"; // restore route for client-router
        }

        if (route.indexOf("/location/") !== -1) {
            if (!req.params || !req.params.suburb) {
                return this.redirectToErrorPage(
                    req, res, 400, "Suburb missing", route);
            }

            route = "/location/:suburb"; // restore route for client-router
        }



        if (global.devMode) { // no cache
            this.websiteIndexFile = fs.readFileSync(path.join(__dirname, "../", "../", "www", "index-website.html"), "utf8");
        }

        var pageData = routerData.getPageData(req, res, route);
        return res.send(ejs.render(this.websiteIndexFile, pageData));
    },



    // Render the error page
    renderErrorPage: function (req, res, errorData) {
        var pageData = routerData.getErrorPageData(req, errorData);

        if (global.devMode) { // no cache
            this.websiteIndexFile = fs.readFileSync(this.websiteIndexFilePath, "utf8");
            this.websiteErrorFile = fs.readFileSync(this.websiteErrorFilePath, "utf8");
        }

        var partial = ejs.render(this.websiteErrorFile, pageData);

        var tempIndex = this.websiteIndexFile.slice(0); // copy string
        tempIndex = tempIndex.replace('id="page-container">', 'id="page-container">' + partial);

        return res.status(pageData.status).send(ejs.render(tempIndex, pageData));
    },



    // Send a json response
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



    // Redirect to error page
    redirectToErrorPage: function (req, res, status, message, route) {
        req.session.errorStatus = status;
        req.session.errorMessage = message;
        req.session.requestedRoute = route;

        return res.redirect("/error");
    },



}

