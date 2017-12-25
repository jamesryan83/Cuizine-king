"use strict";


var app = app || {};



// Client side initialization - runs whenever page is refreshed
if (typeof window != "undefined") { // allows running server side
    $(document).ready(function () {
        app.clientRouter.init();
    });

    // For Cordova
    document.addEventListener("deviceready", function () {
        app.cordova.init();
    }, false);
}



// Client side router
app.clientRouter = {


    // cached html
    htmlFilesLoggedIn: {},
    htmlFilesLoggedOut: {},

    firstLoad: true,


    // Init
    init: function () {
        var self = this;

        this.loadHtmlFiles(function (err) {
            if (err) {
                console.log(err);
                $("#page-container").append("<p class='center'>Error loading page.  Please try again</p>");
                return;
            }

            self.loadPageForRoute();
        });


        // for back button after pushstate
        window.onpopstate = function () {
            self.loadPageForRoute(window.location.pathname, true);
        };
    },



    // Load html files from server or filesystem into memory
    // On cordova load both js files, on server load just required one
    loadHtmlFiles: function (callback) {
        var self = this;
        var loggedInLoaded = false;
        var loggedOutLoaded = false;
        var isCordova = app.util.isCordova();

        var isLoggedInRoute = app.util.isLoggedInRoute();

        if (isCordova || isLoggedInRoute) {
            $.getJSON("/generated/logged-in.json", function (data) {
                self.htmlFilesLoggedIn = data;
                loggedInLoaded = true;
                if (!isCordova || loggedOutLoaded) return callback();
            }).fail(function (err) {
                return callback(err);
            });
        }

        if (isCordova || !isLoggedInRoute) {
            $.getJSON("/generated/logged-out.json", function (data) {
                self.htmlFilesLoggedOut = data;
                loggedOutLoaded = true;
                if (!isCordova || loggedInLoaded) return callback();
            }).fail(function (err) {
                return callback(err);
            });
        }
    },



    // Returns the data and html for a route
    getRouteData: function (route) {
        var routeData = {};

        routeData.pageName = route;

        // TODO : variable routes should be handled by cases below
        // store page
        if (route.indexOf("/store/") === 0) {
            routeData.html = this.htmlFilesLoggedOut["/store/:id"];
            routeData.isLoggedInPage = false;
            routeData.initFunction = this.loggedOutRoutes["/store/:id"].initFunction;
            routeData.pageName = "/store";

        // location page (same as home page)
        } else if (route.indexOf("/location/") === 0) {
            routeData.html = this.htmlFilesLoggedOut["/location/:suburb"];
            routeData.isLoggedInPage = false;
            routeData.initFunction = this.loggedOutRoutes["/location/:suburb"].initFunction;
            routeData.pageName = "/location";

        // logged in page
        } else if (this.htmlFilesLoggedIn[route]) {
            routeData.html = this.htmlFilesLoggedIn[route]; // route & html
            routeData.isLoggedInPage = true;
            for (var v in this.loggedInRoutes[route]) { // add route properties to data obj
                routeData[v] = this.loggedInRoutes[route][v];
            }
            routeData.initFunction = this.loggedInRoutes[route].initFunction;

        // logged out page
        } else if (this.htmlFilesLoggedOut[route]) {
            routeData.html = this.htmlFilesLoggedOut[route];
            routeData.isLoggedInPage = false;
            for (var v in this.loggedOutRoutes[route]) {
                routeData[v] = this.loggedOutRoutes[route][v];
            }
            routeData.initFunction = this.loggedOutRoutes[route].initFunction;

        } else {
            // above falls through to here cause htmlFilesLoggedIn isn't loaded
            // force a reload when going to logged in from logged out page
            if (this.loggedInRoutes[route]) {
                window.location.href = route;
               return;
            }

            return null;
        }

        routeData.route = route;
        return routeData;
    },



    // Load page into #page-container
    loadPageForRoute: function (route, isAfterPopState) {
        var self = this;
        if (!route) route = app.util.getCurrentRoute();

        if (route == "/logout") {
            return app.util.logUserOut();
        }


        // get data for page
        var routeData = this.getRouteData(route);
        if (!routeData) return;


        // load html into page
        $("#page-container").empty();
        $("#page-container").append(routeData.html);
        if (routeData.isLoggedInPage) {
            app.loggedIn.init();
            app.loggedIn[routeData.initFunction](routeData);
        } else {
            app.loggedOut.init();
            app.loggedOut[routeData.initFunction](routeData);
        }

        app.navbar.init(routeData);


        // run ui stuff when page is loaded
        setTimeout(function () {
            self.onUiLoaded(routeData);

            // push route into history, but not on back
            if (!self.firstLoad && !isAfterPopState) {
                if (route != window.location.pathname) {
                    window.history.pushState(null, route, route);
                }
            }

            self.firstLoad = false;
        }, 0);
    },



    // After the ui is loaded
    // Common things for both loggedin/out pages
    onUiLoaded: function (routeData) {
        $("body").css("display", "block");

        // format any date objects on the page
        $(".datetime").each(function (index, el) {
            var d  = new Date($(el).text());
            $(el).text(moment(d).format("MMM-DD-YYYY hh:mm:ss"));
        });
    },



    // -------------- All the page routes --------------


    loggedOutRoutes: {
        "/": {
            title: "Home", // browser tab title
            file: "home", // filename
            initFunction: "homePage" // client startup function
        },
        "/about": {
            title: "About",
            file: "about",
            initFunction: "aboutPage"
        },
        "/help": {
            title: "Help",
            file: "help",
            initFunction: "helpPage"
        },
        "/location/:suburb": {
            title: "Location",
            file: "location",
            initFunction: "locationPage"
        },
        "/store/:id": {
            title: "Store",
            file: "store",
            initFunction: "storePage"
        },


        "/login": {
            title: "Login",
            file: "login",
            initFunction: "loginPage"
        },
        "/store-login": {
            title: "Store Login",
            file: "login",
            initFunction: "storeLoginPage"
        },
        "/verify-account": {
            title: "Verify Account",
            file: "verify-account",
            initFunction: "verifyAccountPage"
        },
        "/reset-password": {
            title: "Reset Password",
            file: "reset-password",
            initFunction: "resetPasswordPage"
        },
        "/register": {
            title: "Register",
            file: "login",
            initFunction: "registerPage"
        },
        "/register-store": {
            title: "Register Store",
            file: "login",
            initFunction: "registerStorePage"
        },
        "/error": {
            title: "Error",
            file: "error",
            initFunction: "errorPage"
        },
        "/logout": {

        },


        "/sysadmin": {
            title: "Sysadmin",
            file: "sysadmin",
            initFunction: "sysadminPage"
        }
    },



    loggedInRoutes: {
        "/business": {
            title: "Business",
            file: "business",
            mainContent: "business",
            initFunction: "businessPage"
        },
        "/dashboard": {
            title: "Dashboard",
            file: "dashboard",
            mainContent: "dashboard",
            initFunction: "dashboardPage"
        },
        "/delivery-suburbs": {
            title: "Delivery Suburbs",
            file: "delivery-suburbs",
            mainContent: "delivery-suburbs",
            initFunction: "deliverySuburbsPage"
        },
        "/menu": {
            title: "Menu",
            file: "menu",
            mainContent: "menu",
            initFunction: "menuPage"
        },
        "/orders": {
            title: "Orders",
            file: "orders",
            mainContent: "orders",
            initFunction: "ordersPage"
        },
        "/settings": {
            title: "Settings",
            file: "settings",
            mainContent: "settings",
            initFunction: "settingsPage"
        },
        "/transactions": {
            title: "Transactions",
            file: "transactions",
            mainContent: "transactions",
            initFunction: "transactionsPage"
        },
    },
}


// create arrays of filepaths for express router
app.clientRouter.loggedOutRoutesList = Object.keys(app.clientRouter.loggedOutRoutes);
app.clientRouter.loggedInRoutesList = Object.keys(app.clientRouter.loggedInRoutes);



if (typeof module !== 'undefined' && this.module !== module) {

    // load html json files
    var fs = require("fs");
    var path = require("path");
    var generatedFilesFolder = path.join(__dirname, "../", "../", "generated");
    try {
        app.clientRouter.htmlFilesLoggedIn = JSON.parse(fs.readFileSync(generatedFilesFolder + "/logged-in.json", "utf-8"));
        app.clientRouter.htmlFilesLoggedOut = JSON.parse(fs.readFileSync(generatedFilesFolder + "/logged-out.json", "utf-8"));
    } catch (ex) { /* might fail during generation if they don't exist yet.  just ignore */ }

    exports = module.exports = app.clientRouter;
}
