"use strict";

var app = app || {};




// Logged out pages
// These are called from client-router
app.loggedOut = {

    initialized: false,


    init: function () {
        this.initialized = true;
    },


    homePage: function (routeData) {
        app.home.init(routeData);
//        $('html, body').animate({ scrollTop: 350 }, 1000);
    },


    aboutPage: function () {

    },


    helpPage: function () {

    },


    locationPage: function (routeData) {
        app.location.init(routeData);
    },


    storePage: function (routeData) {
        app.store.init(routeData);
    },


    loginPage: function (routeData) {
        app.login.init(routeData);
    },


    storeLoginPage: function (routeData) {
        app.login.init(routeData);
    },


    verifyAccountPage: function () {
        app.verifyAccount.init();
    },


    resetPasswordPage: function () {
        app.resetPassword.init();
    },


    registerPage: function (routeData) {
        app.login.init(routeData);
    },


    registerStorePage: function (routeData) {
        app.login.init(routeData);
    },


    errorPage: function () {

    },


    // TODO : move to logged-in.js when auth is working again
    // TODO : lots of security
    sysadminPage: function (routeData) {
        app.sysadmin.init(routeData);
    },

}





app.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.clientRouter.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode);
        });


        $("#navbar-icon").on("click", function () {
            window.location.href = "/location/Balmoral-4171";
        });


        // TODO: get users lat long
//        // Get users location
//        app.util.getUserLatLong(function (result) {
//            if (result) {
//                console.log(result)
//            }
//        });
    },

}




app.location = {

    suburbs: [],
    storeData: [],
    suburbTimeout: null,

    // for heading resizing
    pageWidth: 0,
    regularHeadingWidth: 0,
    locationHeadingWidth: 0,
    headingContainerWidth: 0,
    typeaheadWidth: 0,


    // Init
    init: function (routeData) {
        var self = this;


        // jquery-template formatters for store items
        $.addTemplateFormatter({
            categoryArrayFormatter: function(value, template) {
                return value.join(", ");
            },

            phoneNumberFormatter: function(value, template) {
                return "Ph: " + value;
            },

            deliveryFormatter: function(value, template) {
                return "Delivery " + value;
            },

            minOrderFormatter: function(value, template) {
                return "Min. Order " + value;
            },
        });


        // suburb typeahead
        new app.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.clientRouter.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode);
        });


        // load stores
        app.util.ajaxRequest("GET", "/res/_stores.json", null, function (err, result) {
            if (err) return;

            self.storeData = result;
            self.afterStoreDataLoaded();
        });


        // set location on heading
        var route = routeData.route.slice(0); // clone route

        if (route.indexOf("/location") === 0) {
            var location = route.replace("/location/", "");
            location = location.split("-");

            $("#location-header-location")
                .text(decodeURIComponent(location[0]) + " " + location[1]);
        }


        this.resizeLocationHeading();


        // Resize heading when window resizes
        $(window).on("resize blur focus", function () {
            setTimeout(function () {
                self.resizeLocationHeading();
            }, 400); // doesn't always work without delay
        });
    },


    // TODO : this is a bit yucky, try again with css
    // Resizes the location heading so it's visible
    resizeLocationHeading: function () {
//        console.log("resizing heading");
        if (!document.getElementById("location-header-1")) return; // incase page isn't loaded

        this.pageWidth = document.getElementById("page-location").offsetWidth;
        this.regularHeadingWidth = document.getElementById("location-header-1").offsetWidth;
        this.locationHeadingWidth = document.getElementById("location-header-location").offsetWidth;
        this.headingContainerWidth = document.getElementById("location-header-heading").offsetWidth;
        this.typeaheadWidth = document.getElementById("location-suburb-search").offsetWidth;

        if (this.regularHeadingWidth + this.locationHeadingWidth > this.headingContainerWidth) {
            $("#location-header").addClass("suburb-next-line");
        } else if (this.headingContainerWidth + this.typeaheadWidth < this.pageWidth - 300) {
            $("#location-header").removeClass("suburb-next-line");
        }

        if (this.regularHeadingWidth + this.locationHeadingWidth > this.pageWidth - 60) {
            $("#location-header").addClass("heading-next-line");
        } else {
            $("#location-header").removeClass("heading-next-line");
        }
    },



    // After the store data is loaded
    afterStoreDataLoaded: function () {
        var self = this;
        var locationsLength = -1;
        var locationsText = "";


        // for each category
        for (var i = 0; i < this.storeData.length; i++) {
            locationsLength = this.storeData[i].stores.length;
            locationsText = locationsLength +
                (locationsLength == 1 ? " Location" : " Locations");


            // add category header
            $("#location-store-list").append(
                "<div class='row-heading-container'>" +
                    "<h3>" + this.storeData[i].category + "</h3>" +
                    "<label class='row-heading-label'>" + locationsText + "</label>" +
                "</div>" +
                "<hr />");


            // add stores for category
            var frag = document.createDocumentFragment();
            for (var j = 0; j < this.storeData[i].stores.length; j++) {

                // add the word 'store' to the id for the store el id
                this.storeData[i].stores[j].storeId = "store" + this.storeData[i].stores[j].id_store;

                var item = $("<div></div>")
                    .loadTemplate($("#template-store-list-item"), this.storeData[i].stores[j]);

                // highlight open now
                if (this.storeData[i].stores[j].open == "Open Now") {
                    $(item).find(".store-list-item-text-open").addClass("active");
                }

                // add store image
                $(item).find(".store-list-item-image")
                    .css({ "background-image": "url(" + this.storeData[i].stores[j].image + ")" });

                // add review stars
                var starsRounded = Math.round(this.storeData[i].stores[j].avgReview);
                var stars = $(item).find(".review-stars > div");
                for (var k = 0; k < starsRounded; k++) {
                    $(stars[k]).addClass("active");
                }

                frag.append(item.children(0)[0]);
            }


            // add stores to row
            var storeRow = $(
                "<div class='category-stores-row'>" +
                    "<div class='category-stores-row-inner'></div>" +
                "</div>");

            storeRow.find(".category-stores-row-inner").append(frag);

            $("#location-store-list").append(storeRow);
        }


        // TODO : check events are cleaned up properly
        // add events to each category row
        $(".category-stores-row-inner").each(function (index, el) {
            new app.HorizontalScroller(el, function (clickedEl) {
                var storeEl = $(clickedEl).closest(".store-list-item");
                var storeId = storeEl[0].id.replace("store", "");

                app.clientRouter.loadPageForRoute("/store/" + storeId);
            });
        });


        setTimeout(function () {
            self.resizeLocationHeading();
        }, 100);


        setTimeout(function () { // again just incase
            self.resizeLocationHeading();
        }, 1000);
    },

}




app.login = {


    init: function (routeData) {
        // cached incase the user wants to resend the verification
        // email from the registration success thing
        var registrationData = undefined;


        if (routeData.route == "/login") {
            $("#form-login").removeClass("hidden");
            $("#form-register").addClass("hidden");
            $("#form-register-store").addClass("hidden");
        }

        if (routeData.route == "/store-login") {
            $("#form-store-login").removeClass("hidden");
            $("#form-login").addClass("hidden");
        }

        if (routeData.route == "/register") {
            $("#form-login").addClass("hidden");
            $("#form-register").removeClass("hidden");
            $("#form-register-store").addClass("hidden");
        }

        if (routeData.route == "/register-store") {
            $("#form-login").addClass("hidden");
            $("#form-register").addClass("hidden");
            $("#form-register-store").removeClass("hidden");
        }


        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/login", data, function (err, result) {
                if (err) return false;

                if (!result.jwt) alert("jwt missing");

                // add token to storage for api calls later
                app.util.addJwtToStorage(result.jwt);

                window.location.href = "/";
            });

            return false;
        });


        // Submit store login form
        $("#form-store-login").on("submit", function () {
            window.location.href = "/dashboard";

//            var data = validate.collectFormValues($("#form-store-login")[0], { trim: true });
//
//            if (!app.util.validateInputs(data, app.validationRules.login))
//                return false;
//
//            app.util.ajaxRequest("POST", "/api/v1/store-login", data, function (err, result) {
//                if (err) return false;
//
//                if (!result.jwt) alert("jwt missing");
//
//                // add token to storage for api calls later
//                app.util.addJwtToStorage(result.jwt);
//
//                window.location.href = "/dashboard";
//            });

            return false;
        });



        // Submit register form
        $("#form-register").on("submit", function () {
            if (!$("#checkbox-tnc").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-register")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.peopleCreate))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/register", registrationData, function (err) {
                if (err) return;

                $("#form-register").addClass("hidden-other");
                $("#registration-success").removeClass("hidden");
                $("#registration-success-email").text(registrationData.email);
            });

            return false;
        });


        // Submit register store form
        $("#form-register-store").on("submit", function () {
            if (!$("#checkbox-tnc-store").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-register-store")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.registerStore))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/register-store", registrationData, function (err) {
                if (err) return;

                $("#form-register-store").addClass("hidden-other");
                $("#registration-success").removeClass("hidden");
                $("#registration-success-email").text(registrationData.email);
            });

            return false;
        });


        // Send forgot password email
        $("#form-forgot-password").on("submit", function () {
            var email = validate.collectFormValues(this, { trim: true });
            if (!app.util.validateInputs(email, app.validationRules.forgotPassword))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/forgot-password", email, function (err, data) {
                if (!err && data) {
                    app.util.showToast(data.message, 4000);
                }
            });

            return false;
        });



        // TODO : try to minimise this stuff a bit
        // ----------- Buttons -----------

        // login goto register
        $("#login-goto-register").on("click", function () {
            $("#form-register").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Register";
            window.history.pushState(null, "register", "register");
        });


        // login goto store login
        $("#login-goto-store-login").on("click", function () {
            $("#form-store-login").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Store Login";
            window.history.pushState(null, "store-login", "store-login");
        });


        // store login goto login
        $("#store-login-goto-login").on("click", function () {
            $("#form-store-login").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // login goto register store
        $("#login-goto-register-store").on("click", function () {
            $("#form-register-store").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Register Store";
            window.history.pushState(null, "register-store", "register-store");
        });


        // login goto forgot password
        $("#login-forgot-password").on("click", function () {
            $("#form-login").addClass("hidden");
            $("#form-forgot-password").removeClass("hidden");
        });


        // register goto login
        $("#register-goto-login").on("click", function () {
            $("#checkbox-tnc").prop("checked", false);
            $("#form-register").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // register store goto login
        $("#register-store-goto-login").on("click", function () {
            $("#checkbox-tnc-store").prop("checked", false);
            $("#form-register-store").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // forgot password goto login
        $("#forgot-password-goto-login").on("click", function () {
            $("#form-login").removeClass("hidden");
            $("#form-forgot-password").addClass("hidden");
        });


        // Resend registration email button
        $("#registration-success-resend").on("click", function () {
            if (!registrationData) {
                app.util.showToast("Unable to send email.  Please refresh the page", 4000);
                return;
            }

            app.util.ajaxRequest("POST", "/api/v1/registration-email", registrationData, function (err) {
                if (err) return;

                app.util.showToast("Registration email has been resent.  Please check your emails");
            });
        });




    },


}





// Reset password

app.resetPassword = {

    init: function () {
        var self = this;

        this.resetPasswordToken = window.location.search;
        if (!this.resetPasswordToken || this.resetPasswordToken.length < 30) {
            app.util.showToast("Invalid verification token", 4000);
            return;
        }

        this.resetPasswordToken = this.resetPasswordToken.substr(3, this.resetPasswordToken.length);


        // Submit reset password form
        $("#form-reset-password").on("submit", function () {
            var data = validate.collectFormValues($("#form-reset-password")[0], { trim: true });

            data.token = self.resetPasswordToken;

            if (!app.util.validateInputs(data, app.validationRules.resetPassword))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/reset-password", data, function (err, result) {
                if (err) return;

                window.location.href = "/login";
            }, true);

            return false;
        });
    }
}





app.store = {

    init: function (routeData) {

    },

}




app.sysadmin = {

    init: function (routeData) {
        var self = this;

        new app.TabControl("#page-sysadmin-tabcontrol", function (tab) {

        });


        $("#form-create-store").on("submit", function () {
            var data = validate.collectFormValues($("#form-create-store")[0], { trim: true });

//            if (!app.util.validateInputs(data, app.validationRules.login))
//                return false;


            console.log(data)

//            app.util.ajaxRequest("POST", "/api/v1/create-store", data, function (err, result) {
//                if (err) return false;
//
//
//            });

            return false;
        });

    },

}



// Verify Account

app.verifyAccount = {

    init: function () {
        var self = this;

        this.verificationToken = window.location.search;
        if (!this.verificationToken || this.verificationToken.length < 30) {
            app.util.showToast("Invalid verification token", 4000);
            return;
        }

        this.verificationToken = this.verificationToken.substr(3, this.verificationToken.length);


        // Submit verify account form
        $("#form-verify-account").on("submit", function () {
            var data = validate.collectFormValues($("#form-verify-account")[0], { trim: true });

            data.token = self.verificationToken;

            if (!app.util.validateInputs(data, app.validationRules.verifyAccount))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/verify-account", data, function (err, result) {
                if (err) return;

                if (!result.jwt) alert("jwt missing");

                // add token to storage for api calls later
                app.util.addJwtToStorage(result.jwt);

                window.location.href = "/dashboard";
            }, true);

            return false;
        });
    }
}
// ?t=7h5GAbJWWfGBrPtEXk2DeAIA2rYC49GB6n6xVCUwwGpo0emkE3






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







app.data = {

    categories: [
        "American",
        "Asian",
        "Asian Fusion",
        "Australian",
        "Bakery",
        "Bar Food",
        "BBQ",
        "Brazilian",
        "Breakfast and brunch",
        "Burger",
        "Cafe",
        "Chinese",
        "Coffee and tea",
        "Comfort Food",
        "Cupcake",
        "Deli",
        "Desserts",
        "Diner",
        "Dumpling",
        "English",
        "European",
        "Fast Food",
        "Fish and chips",
        "French",
        "German",
        "Gluten-free",
        "Gluten-free friendly",
        "Greek",
        "Halal",
        "Healthy",
        "Ice cream and frozen yoghurt",
        "Indian",
        "Indonesian",
        "Italian",
        "Jamaican",
        "Japanese",
        "Juice and smoothies",
        "Korean",
        "Latin American",
        "Latin Fusion",
        "Lebanese",
        "Malaysian",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Modern Australian",
        "Modern European",
        "Moroccan",
        "Nepalese",
        "North Indian",
        "Pakistani",
        "Pastry",
        "Pizza",
        "Pub",
        "Salad",
        "Sandwich",
        "Seafood",
        "Singaporean",
        "Soul Food",
        "South Indian",
        "Spanish",
        "Street Food",
        "Sushi",
        "Thai",
        "Turkish",
        "Vegan",
        "Vegan friendly",
        "Vegan-Friendly",
        "Vegetarian",
        "Vegetarian friendly",
        "Vietnamese",
        "West Indian",
        "Western",
        "Wings"
    ],

}



// Logged out navbar




app.navbar = {

    init: function (routeData) {

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);


        // Item clicked
        $(".navbar a").on("click", function () {
            if (this.innerText == "blog" || this.innerText == "account")
                return false;

            var route = this.href.replace(window.location.origin, "");
            app.clientRouter.loadPageForRoute(route);

            return false;
        });


        // Popup icon to show/hide
        $(".navbar-links-popup-button").on("click", function () {
            $(".navbar-links-popup").animate({ right: 0 }, 200);
        });

        $(".navbar-links-popup-close").on("click", function () {
            $(".navbar-links-popup").animate({ right: -200 }, 200);
        });


        // Debug
        $(".navbar-icon").on("click", function (e) {
            if (e.ctrlKey) {
                window.location.href = "/sysadmin";
            }
        });

        this.updateNavbar(routeData);
    },


    // Update the navbar when the route changes
    updateNavbar: function (routeData) {
        var r = routeData.route;

        $(".navbar-links a").removeClass("active");

        if (r.indexOf("/location") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            console.log(routeData.file)
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }

        // if logged in
        if (app.util.isLoggedIn()) {
            $(".navbar-link-dashboard").show();
            $(".navbar-link-logout").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
        }
    }


}



// Horizontal scroller
app.HorizontalScroller = function (containerEl, clickCallback) {

    var mouseIsDown = false;
    var startMouseX = 0;
    var startPosX = 0;
    var currentX = 0;


    $(containerEl).on("mousedown", function (e) {
        mouseIsDown = true;
        startMouseX = e.clientX;
        startPosX = $(this).scrollLeft();
    });


    $(window).on("mousemove", function (e) {
        if (mouseIsDown) {
            e.stopPropagation();
            $(containerEl).scrollLeft(startPosX - (e.clientX - startMouseX));
        }
    });


    $(window).on("mouseup", function (e) {
        mouseIsDown = false;
    });


    // click callback if mouse doesn't move much
    $(containerEl).on("mouseup", function (e) {
        var diff = e.clientX - startMouseX;

        if (diff >= -3 && diff <= 3) {
            clickCallback(e.target);
        }
    });
}



// Tab control
app.TabControl = function (tabcontrolEL, clickCallback) {

    // tab and tabcontent elements
    var tabEls = $(tabcontrolEL).find(".tabs li");
    var tabItemEls = $(tabcontrolEL).find(".tab-item");

    // Set active tab and tabcontent when a tab is clicked
    $(tabEls).on("click", function (e) {
        $(tabEls).removeClass("active");
        $(tabItemEls).removeClass("active");

        var clickedTabIndex = $(e.target).index();
        $(tabEls[clickedTabIndex]).addClass("active");
        $(tabItemEls[clickedTabIndex]).addClass("active");
    });

}



// Creates a typeahead control
app.Typeahead = function (inputEl, listEl, itemList, callback) {
    var typeaheadList = $(listEl);

    var typeaheadTimeout = null;


    // when a dropdown item is selected
    function selectItem (el) {
        $(listEl).prev().val(el.innerText); // put selected item into input
        $(listEl).hide();

        return callback({
            suburb: encodeURIComponent($(el).find(".typeahead-item-suburb").text()),
            postcode: $(el).find(".typeahead-item-postcode").text()
        });
    }


    // list item clicked
    $(listEl).on("click", function (e) {
        selectItem(e.target);
    });


    // when typing, generate dropdown list
    $(inputEl).on("keyup", function (e) {
        var value = $(this).val().toLowerCase();

        // esc
        if (e.which == 27) return;

        // enter
        if (e.which == 13) {
            var selectedItem = $(".typeahead-item.active");
            if (selectedItem.length > 0) {
                selectItem(selectedItem[0]);
            }
            return;
        }

        // up arrow select previous item
        if (e.which == 38) {
            var items = $(".typeahead-item");
            for (var i = 0; i < items.length; i++) {
                if ($(items[i]).hasClass("active")) {
                    $(items[i]).removeClass("active");
                    $(items[i]).prev().addClass("active");
                    break;
                }

                if (i == items.length - 1) {
                    $(items[items.length - 1]).addClass("active");
                }
            }
            return;
        }

        // down arrow select next item
        if (e.which == 40) {
            var items = $(".typeahead-item");
            for (var i = items.length - 1; i >= 0; i--) {
                if ($(items[i]).hasClass("active")) {
                    $(items[i]).removeClass("active");
                    $(items[i]).next().addClass("active");
                    break;
                }

                if (i == 0) $(items[0]).addClass("active");
            }
            return;
        }


        // allow a lookup every x ms
        clearTimeout(typeaheadTimeout);
        typeaheadTimeout = setTimeout(function () {
            if (!value) {
                $("#suburb-search-list").hide();
                return;
            }

            // get locations from server
            var url = "/api/v1/location?q=" + value;
            app.util.ajaxRequest("GET", url, null, function (err, result) {
                if (err) return;

                // create new list items
                var listItems = [];
                for (var i = 0; i < result.data.length; i++) {
                    listItems.push(
                        "<li class='typeahead-item'>" +
                            "<label class='typeahead-item-postcode'>" + result.data[i].postcode + "</label>" +
                            "<span>\u2654</span>" +
                            "<label class='typeahead-item-suburb'>" + app.util.toTitleCase(result.data[i].suburb) + "</label>" +
                        "</li>");
                }

                typeaheadList.empty();

                // add list items
                if (listItems.length > 0) {
                    typeaheadList.append(listItems.join(""));
                    typeaheadList.show();
                } else {
                    typeaheadList.show();
                    typeaheadList.append(
                        "<li class='typeahead-item'>NO RESULTS</li>");
                }
            });
        }, 500);
    });


    // hide when click outside control
    $(window).on("mousedown", function (e) {
        if (e.target.className != "typeahead-item") {
            $("#suburb-search-list").hide();
        }
    });


    // hide when esc is presed
    $(window).on("keydown", function (e) {
        if (e.which == 27) {
            $("#suburb-search-list").hide();
        }
    });

}





app.util = {


    // Get the users location
    getUserLatLong: function (callback) {
        // TODO: get users lat long
    },


    // Validates an inputs object and shows toast if there's an error
    validateInputs: function (inputs, validationRule) {
        var errors = validate(inputs, validationRule, { format: "flat" });
        if (errors && errors.length > 0) {
            this.showToast(errors[0]);
            return false;
        }

        return true;
    },


    // Returns the current page (e.g. /home)
    getCurrentRoute: function () {
        var route = window.location.pathname;

        if (app.util.isCordova()) {
            route = route.substring(route.lastIndexOf("/"), route.length - 5);
            if (route == "/index-cordova") route = "/";
        }

        return route;
    },


    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
    },


    // Get if the user is logged in
    isLoggedIn: function () {
        var jwt = this.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },


    // Get if the user is on a logged in route
    isLoggedInRoute: function () {
        return app.clientRouter.loggedInRoutesList
            .indexOf(this.getCurrentRoute()) !== -1;
    },


    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        var self = this;

        app.util.ajaxRequest("GET", "api/v1/logout", {}, function (err) {
            if (err) return;

            self.invalidateJwt();
            window.location.href = "/login";
        });
    },


    // Show toast
    showToast: function (message, timeout) {
        var toast = $("<p>" + message + "</p>");

        // remove toasts if there's too many stacked up
        if ($("#toasts").children().length >= 5) {
            $("#toasts").children().first().remove();
        }

        // append toasts message and show toasts
        $("#toasts").append(toast[0]);
        $("#toasts").show();

        // hide toast after a little bit
        var currentToast = setTimeout(function () {
            toast.remove();

            // hide container if it's empty
            if ($("#toasts").children().length === 0) {
                $("#toasts").hide().empty();
            }
        }, timeout || 2000);
    },


    // Show loading screen
    showLoadingScreen: function () {
        $("#loading-screen").show();
    },


    // Hide loading screen
    hideLoadingScreen: function () {
        $("#loading-screen").hide();
    },


    // Add token to storage
    addJwtToStorage: function (token) {
        localStorage.setItem("jwt", token);
    },


    // Returns token from storage
    getJwtFromStorage: function () {
        return localStorage.getItem("jwt");
    },


    // Replace current jwt with an invalid one
    invalidateJwt: function () {
        localStorage.setItem("jwt", "invalidToken");
    },


    // First letter of each word in a string to uppercase
    // https://stackoverflow.com/a/4878800
    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },


    // Preload images so they don't pop in when loading
    preloadImages: function (folderPath, arrayOfImagePaths) {
        var images = [];
        var counter = 0;

        // this creates a new image for each path and sets the src
        // when they'r all loaded the images [] is set to null
        for (var i = 0; i < arrayOfImagePaths.length; i++) {
            images.push(new Image());
            images[i].src = folderPath + arrayOfImagePaths[i];
            images[i].onload = function () {
                counter++;
                if (counter === images.length) images = null;
            }
        }
    },


    // Generic ajax request - returns (err, data)
    ajaxRequest: function (type, url, data, callback) {
        var self = this;
        if (data) {
            var auth = data.auth == true;
            delete data.auth;
        }

        $.ajax({
            type: type,
            url: url,
            data: data,
            beforeSend: function(request) {
                if (auth) {
                    request.setRequestHeader("Authorization", "Bearer " + app.util.getJwtFromStorage());
                }
            },
            success: function (result) {
                return callback(null, result);
            },
            error: function (err) {
                console.log(err);

                if (err) {
                    if (err.responseJSON && err.responseJSON.err) {
                        self.showToast(err.responseJSON.err.message, 4000);
                    } else {
                        self.showToast("Server Error", 4000);
                    }
                }

                return callback(err);
            }
        });
    },

};


// Validation
// https://validatejs.org/

// these are related to the tables in server/sql
// and are used server and client side



app.validationRules = {};
var vr = app.validationRules;



// General shared validation rules

// for sequence id's such as id_store, id_adress, updated_by etc.
vr._sequence_id = { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
vr._sequence_id_optional = { numericality: { onlyInteger: true, greaterThan: 0 }};

vr._email =                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }};
vr._email_optional =        { email: true, length: { minimum: 3, maximum: 256 }};
vr._phone_number =          { presence: true, length: { minimum: 3, maximum: 32 }};
vr._phone_number_optional = { length: { minimum: 3, maximum: 32 }};
vr._url_link =              { presence: true, length: { maximum: 256 }};
vr._url_link_optional =     { length: { maximum: 256 }};
vr._bit =                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
vr._bit_optional =          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
vr._notes_optional =        { length: { maximum: 256 }};
vr._price =                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }};
vr._price_optional =        { numericality: { greaterThanOrEqualTo: 0 }};
vr._quantity =              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
vr._latitude_optional =     { numericality: { greaterThanOrEqualTo: 0 }};
vr._longitude_optional =    { numericality: { greaterThanOrEqualTo: 0 }};


// these groups of validation things match the values in the sql tables
// values not here are using the generic values above

vr._addresses_line1 =                  { presence: true, length: { maximum: 128 }};
vr._addresses_line2_optional =         { length: { maximum: 128 }};

vr._people_first_name =                    { presence: true, length: { minimum: 2, maximum: 45 }};
vr._people_first_name_optional =           { length: { minimum: 2, maximum: 45 }};
vr._people_last_name =                     { presence: true, length: { minimum: 2, maximum: 45 }};
vr._people_last_name_optional =            { length: { minimum: 2, maximum: 45 }};
vr._people_password =                      { presence: true, length: { minimum: 3, maximum: 64 }};
vr._people_reset_password_token =          { presence: true, length: 64 };
vr._people_reset_password_token_optional = { presence: true, length: 64 };
vr._people_jwt_optional =                  { length: { minimum: 30, maximum: 512 }};
vr._people_verification_token =            { presence: true, length: 64 };

vr._postcodes_postcode = { presence: true, length: { minimum: 1, maximum: 6 }};
vr._postcodes_suburb =   { presence: true, length: { minimum: 1, maximum: 64 }};
vr._postcodes_state =    { presence: true, length: { minimum: 1, maximum: 32 }};

vr._business_hours_day =    { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 8 }};
vr._business_hours_opens =  { presence: true, length: { maximum: 8 }};
vr._business_hours_closes = { presence: true, length: { maximum: 8 }};

vr._reviews_title =           { presence: true, length: { minimum: 2, maximum: 128 }};
vr._reviews_review_optional = { length: { maximum: 512 }};
vr._reviews_rating =          { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }};

vr._stores_logo =                 { presence: true, length: { maximum: 256 }};
vr._stores_name =                 { presence: true, length: { maximum: 512 }};
vr._stores_description_optional = { length: { maximum: 1024 }};
vr._stores_abn =                  { presence: true, length: { maximum: 32 }};

vr._product_extras_name = { presence: true, length: { maximum: 128 }};

vr._product_options_name = { presence: true, length: { maximum: 128 }};

vr._products_name =                 { presence: true, length: { maximum: 128 }};
vr._products_description_optional = { length: { maximum: 256 }};

vr._order_products_customer_notes_optional = { length: { maximum: 256 }};

vr._orders_notes_optional = { length: { maximum: 256 }};
vr._orders_expiry =         { presence: true, datetime: true }; // TODO: does this work ?

vr._transactions_commission =     { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }; // TODO : is 1000 ok ?
vr._transactions_processing_fee = { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } };









// These validation objects below use the values from above

// -------- Auth route validation --------


vr.login = {
    email: vr._email,
    password: vr._people_password
}


vr.peopleCreate = {
    first_name: vr._people_first_name,
    last_name: vr._people_last_name,
    email: vr._email,
    password: vr._people_password,
    confirmPassword: { equality: "password" }
}

vr.sendRegistrationEmail = { email: vr._email }


vr.verifyAccount = {
    email: vr._email,
    password: vr._people_password,
    token: vr._people_verification_token
}


vr.forgotPassword = { email: vr._email }


vr.resetPassword = {
    password: vr._people_password,
    confirmPassword: { equality: "password" },
    token: vr._people_reset_password_token
}




// -------- Store route validation --------

vr.createStore = {
    postcode: vr._postcodes_postcode,
    suburb: vr._postcodes_suburb,
    unit_number: vr._addresses_unit_number_optional,
    street_number: vr._addresses_street_number,
    street: vr._addresses_street,
    first_name: vr._people_first_name,
    last_name: vr._people_last_name,
    email_user: vr._email,
    phone_number_user: vr._phone_number,
    password: vr._people_password,
    jwt: vr._people_jwt_optional, // TODO : Might not need to check this here
    internal_notes_user: vr._notes_optional,
    logo:vr._stores_logo,
    name: vr._stores_name,
    description: vr._stores_description_optional,
    email_store: vr._email,
    phone_number_store: vr._phone_number,
    website: vr._url_link_optional,
    facebook: vr._url_link_optional,
    twitter: vr._url_link_optional,
    abn: vr._stores_abn,
    internal_notes_store: vr._notes_optional
}





// -------- API validation --------


// Me
vr.apiMeGet = { email: vr._email }

vr.apiMeUpdate = {
    id_user: vr._sequence_id_optional,
    email: vr._email_optional,
    token: vr._people_reset_password_token_optional,
    first_name: vr._people_first_name_optional,
    last_name: vr._people_last_name_optional
}

vr.apiMeDelete = { email: vr._email }



