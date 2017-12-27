"use strict";

var app = app || {};




// Logged in pages
// These are called from client-router
app.loggedIn = {

    initialized: false,


    init: function () {
        this.initialized = true;
    },


    dashboardPage: function () {
        app.main.dashboard.init();
    },


    ordersPage: function () {
        app.main.orders.init();
    },


    deliverySuburbsPage: function () {
        app.main.deliverySuburbs.init();
    },


    menuPage: function () {
        app.main.menu.init();
    },


    transactionsPage: function () {
        app.main.transactions.init();
    },


    businessPage: function () {
        app.main.business.init();
    },


    settingsPage: function () {
        app.main.settings.init();
    },

}



app.main = app.main || {};


// Business page
app.main.business = {

    init: function () {
        var self = this;

        $("#main-account-save").on("click", function () {
            var data = validate.collectFormValues($("#form-main-account")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.mainAccountSave))
                return false;

            console.log(data)

            return false;
        });


        $("#main-account-change-password").on("click", function () {
            var email = $("label[name='email']").text();

            if (!app.util.validateInputs({ email: email }, app.validationRules.forgotPassword))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/forgot-password", { email: email }, function (err, data) {
                if (!err && data) {
                    app.util.showToast(data, 4000);
                }
            });
        });


        $("#main-account-delete-account").on("click", function () {
            console.log("delete-account")
        });


//        // Get account data
//        app.util.ajaxRequest("GET", "api/v1/me", { auth: true }, function (err, result) {
//            if (err) return;
//
//            // add data to ui
//            for (var propName in result) {
//                var el = $("[name='" + propName + "']");
//                if (el.prop("nodeName") === "INPUT") {
//                    $(el).val(result[propName]);
//                } else if (el.prop("nodeName") === "IMG") {
//                    $(el).attr("src", result[propName]);
//                } else {
//                    $(el).text(result[propName]);
//                }
//            }
//        });
    },

}


app.main = app.main || {};


// Dashboard page
app.main.dashboard = {

    init: function () {
        var self = this;
    },

}


app.main = app.main || {};


// Delivery suburbs page
app.main.deliverySuburbs = {

    init: function () {
        var self = this;
    },

}


app.main = app.main || {};


// Menu page
app.main.menu = {



    init: function () {
        var self = this;

        var editMenuPopup = $("#popup-edit-menu-item");

        $("#main-menu-edit").on("click", function () {
            editMenuPopup.addClass("active")
        });

        $("#main-menu-edit-cancel").on("click", function () {
            editMenuPopup.removeClass("active");
        });

        $("#main-menu-edit-save").on("click", function () {
            editMenuPopup.removeClass("active");
        });
    },

}


app.main = app.main || {};


// Orders page
app.main.orders = {

    init: function () {
        var self = this;
    },

}


app.main = app.main || {};


// Settings page
app.main.settings = {

    init: function () {
        var self = this;
    },

}


app.main = app.main || {};


// Transactions page
app.main.transactions = {

    init: function () {
        var self = this;
    },

}






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


        // Debug - go to sysadmin page when click on the icon
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



app.RatingControl = function () {

//    // Returns the current rating value from a rating control
//    getRatingControlValue: function (formEl) {
//        return $(formEl + " .rating-control-star.active").length;
//    },
//
//
//
//    // update current user rating controls
//    updateRatingControls: function (ratings) {
//        for (var i = 0; i < ratings.length; i++) {
//            if (ratings[i].id_review) {
//                var ratingControl = $(".rating-control-stars.user[data-id='" + ratings[i].id_review + "']");
//
//                for (var j = 0; j < ratings[i].rating; j++) {
//                    ratingControl.children().eq(j).addClass("active");
//                }
//            }
//        }
//    },
//
//
//    // Adds click events to all the rating controls
//    // bit easier to do it this way when there's not many reviews
//    recreateRatingControlEvents: function () {
//        var self = this;
//        $(".rating-control-star").off();
//        $(".rating-control-star").unbind();
//
//
//        // has the user used this star control before
//        var isUnused = false;
//
//
//        // Rating control star clicked
//        $(".rating-control-star").on("click", function () {
//            if (!$(this).hasClass("active") && !$(this).siblings().hasClass("active")) {
//                isUnused = true;
//            }
//
//            $(this).removeClass("active");
//            $(this).siblings().removeClass("active");
//            $(this).addClass("active");
//            $(this).prevAll().addClass("active");
//        });
//
//
//        // User rating control
//        $(".rating-control-stars.user .rating-control-star").on("click", function (e) {
//            this.allowUserStarUpdate = false;
//
//            if (!$(this).hasClass("active") && !$(this).siblings().hasClass("active")) {
//                isUnused = true;
//            }
//
//            var star = this;
//
//            // let other click event finish first
//            setTimeout(function () {
//                var parent = $(star).closest(".review-item");
//                var title = parent.find(".review-item-title").first().text();
//                var id_review = parent.data("id");
//                var rating = ($(star).hasClass("active") ? 1 : 0) +
//                    $(star).siblings(".active").length;
//
//                // send rating to server
//                app.network.updateUserRating(id_review, rating, function (avg_rating) {
//                    self.allowUserStarUpdate = true;
//
//                    if (avg_rating) {
//
//                        // update the OTHERS label if this is the first time the user has voted
//                        if (isUnused) {
//                            isUnused = false;
//                            var votesEl = parent.find(".review-item-votes-others");
//                            var currentVotes = votesEl.data("id");
//                            votesEl.data("id", currentVotes + 1);
//                            votesEl.text("OTHERS: (" + (currentVotes + 1) + ")");
//                        }
//
//                        // update the others stars
//                        var reviewRatingControl = parent.find(".rating-control-stars.inactive").first();
//                        reviewRatingControl.children().removeClass("active");
//                        for (var j = 0; j < avg_rating; j++) {
//                            reviewRatingControl.children().eq(j).addClass("active");
//                        }
//
//                        app.util.showToast("Updated rating for " + title, true);
//                    }
//                });
//            }, 100);
//
//        });
//
//    },

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
                if (err) {
                    if (err.responseJSON && err.responseJSON.err) {
                        self.showToast(err.responseJSON.err, 4000);
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



