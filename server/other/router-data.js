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
console.log(route)
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



    getDebugPageData: function (callback) {
        var query =
            "SELECT * FROM Auth.jwts;" +
            "SELECT * FROM Auth.login_attempts;" +
            "SELECT * FROM Auth.login_lockouts;" +
            "SELECT * FROM Auth.users;" +
            "SELECT * FROM Auth.users_companies;" +
            "SELECT * FROM Auth.users_pending;" +
            "SELECT * FROM Store.companies;" +
            "SELECT * FROM Store.customers;" +
            "SELECT * FROM Store.orders;" +
            "SELECT * FROM Store.stores;" +
            "SELECT * FROM Store.stores_companies;" +
            "SELECT * FROM addresses;" +
            "SELECT * FROM postcodes;" +
            "SELECT * FROM sessions;" +
            "SELECT * FROM Product.product_extras;" +
            "SELECT * FROM Product.product_options;" +
            "SELECT * FROM Product.products;" +
            "SELECT * FROM Product.products_product_extras;" +
            "SELECT * FROM Product.products_product_options;";

        database.executeQuery(query, function (err, data) {
            if (err) return callback(err);

            var tableNames = [
                "Auth-jwts",
                "Auth-login_attempts",
                "Auth-login_lockouts",
                "Auth-users",
                "Auth-users_companies",
                "Auth-users_pending",
                "Store-companies",
                "Store-customers",
                "Store-orders",
                "Store-stores",
                "Store-stores_companies",
                "addresses",
                "postcodes",
                "sessions",
                "Product-product_extras",
                "Product-product_options",
                "Product-products",
                "Product-products_product_extras",
                "Product-products_product_options"];

            var output = [];
            for (var i = 0; i < data.recordsets.length; i++) {
                output.push({ table: tableNames[i], data: data.recordsets[i] });
            }


            return callback(err, output);
        });
    },

}