"use strict";

var database = require("../database/database.js");
var clientRouter = require("../../www/js/shared/client-router");


// This handles the server side data for the router
exports = module.exports = {

    router: null,

    init: function (router) {
        this.router = router;
    },


    // Returns the data for a regular page
    getPageData: function (req, res, route) {

        var pageData = clientRouter.loggedInRoutes[route];
        if (!pageData) {
            pageData = clientRouter.loggedOutRoutes[route];
            pageData.style = "logged-out";
            pageData.script = "logged-out";
        } else {
            pageData.style = "logged-in";
            pageData.script = "logged-in";
        }

        pageData.isLoggedIn = req.isAuthenticated();

        if (route == "/verify-account") {
            pageData.verification_token = !req.query ? null : req.query.t;
        }

        if (route == "/reset-password") {
            pageData.reset_password_token = !req.query ? null : req.query.t;
        }

        return pageData;
    },


    // Returns the data for the error page
    getErrorPageData: function (req, errorData) {
        var pageData = clientRouter.getRouteData("/error");
        pageData.status = errorData.status || req.session.errorStatus || 500;
        pageData.style = "logged-out";
        pageData.script = "logged-out";
        pageData.title = "Error - " + pageData.status;
        pageData.message = req.session.errorMessage || "There was an error :`(";
        pageData.route = req.session.requestedRoute || req.url;

        return pageData;
    },

}