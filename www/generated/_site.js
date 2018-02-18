"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// Site pages
app.site = {

    htmlFiles: {}, // cached html

    regexUrlAccount: /\/account\/\d*/,
    regexUrlLocation: /\/location\/[\w\d%-]*-\d*/,
    regexUrlStore: /\/store\/\d*/,


    init: function (html) {
        var self = this;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        this.htmlFiles = html;

        // setup router
        app.routerBase.init();


        // setup dialogs
        app.dialogs.description.init();
        app.dialogs.businessHours.init();
        app.dialogs.reviews.init();

        app.routerBase.loadPageForRoute(null, "site");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.site.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;

        if (this.regexUrlStore.exec(route)) {
            route = "/store/:id";
            match = true;
        } else if (this.regexUrlLocation.exec(route)) {
            route = "/location/:suburb";
            match = true;
        } else if (this.regexUrlAccount.exec(route)) {
            route = "/account/:id";
            match = true;
        }

        return { route: route, match: match };
    },


    // Site routes
    routes: {
        "/": {
            title: "Home", // browser tab title
            file: "home", // filename
            initFunction: function (routeData) {
                app.site.home.init(routeData);
            },
        },
        "/account/:id": {
            title: "Account",
            file: "account",
            initFunction: function (routeData) {
                app.site.account.init(routeData);
            },
        },
        "/about": {
            title: "About",
            file: "about",
            initFunction: function (routeData) {

            },
        },
        "/help": {
            title: "Help",
            file: "help",
            initFunction: function (routeData) {

            },
        },
        "/location/:suburb": {
            title: "Location",
            file: "location",
            initFunction: function (routeData) {
                app.site.location.init(routeData);
            },
        },
        "/store/:id": {
            title: "Store",
            file: "store",
            initFunction: function (routeData) {
                app.site.store.init(routeData);
            },
        },

        "/login": {
            title: "Login",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/store-login": {
            title: "Store Login",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/verify-account": {
            title: "Verify Account",
            file: "verify-account",
            initFunction: function (routeData) {
                app.site.verifyAccount.init(routeData);
            },
        },
        "/reset-password": {
            title: "Reset Password",
            file: "reset-password",
            initFunction: function (routeData) {
                app.site.resetPassword.init(routeData);
            },
        },
        "/register": {
            title: "Register",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
        "/store-application": {
            title: "Store Application",
            file: "login",
            initFunction: function (routeData) {
                app.site.login.init(routeData);
            },
        },
    }

}


// create arrays of filepaths for express router
app.site.routesList = Object.keys(app.site.routes);


// User account page
app.site.account = {


    // Init
    init: function (routeData) {
        var self = this;

        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/account", auth: true
        }, function (err, result) {
            if (err) {
                app.util.invalidateCredentialsAndGoToLogin();
                return;
            }

            console.log(result);

            self.afterInit();
        });
    },


    // After init
    afterInit: function () {
        $(".page-content").show();


        // Delete account button
        $("#delete-account").on("click", function () {
            app.util.showLoadingScreen();

            app.util.ajaxRequest({
                method: "GET", url: "/api/v1/delete-user", auth: true
            }, function (err, result) {
                app.util.hideLoadingScreen();
                if (err) return;

                app.util.invalidateCredentialsAndGoToLogin();
                return;
            });
        });

    },

}

// Add to order dialog
app.dialogs.addToOrder = {

    dialogEl: "#dialog-store-add-to-order",
    dialogCloseEl: "#dialog-store-add-to-order-close",

    init: function (text) {
        var self = this;

        $(this.dialogCloseEl).off().on("click", function () {
            self.hide();
        });
    },

    show: function () {
        $("#dialog-container").show();
        $(this.dialogEl).show();
    },

    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}

// Checkout dialog
app.dialogs.checkout = {

    // Init
    init: function () {

    },

    show: function () {
        $("#dialog-container").show();
    },

    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;

    },

}
// Location page with list of stores
app.site.location = {

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


        // load stores
        app.util.ajaxRequest({
            method: "GET", url: "/res/_stores.json"
        }, function (err, result) {
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
                var stars = $(item).find(".rating-control-static > div");
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
            new app.controls.HorizontalScroller(el, function (clickedEl) {
                var storeEl = $(clickedEl).closest(".store-list-item");
                var storeId = storeEl[0].id.replace("store", "");

                app.routerBase.loadPageForRoute("/store/" + storeId, "site");
            });
        });
    },

}
// Login, register, store-login, store application etc
app.site.login = {


    init: function (routeData) {
        var self = this;



        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/login", data: data
            }, function (err, result) {
                if (err) return false;

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);

                app.routerBase.loadPageForRoute("/account/" + result.data.id_person, "site");
            });

            return false;
        });



        // Submit store login form
        $("#form-store-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-store-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-login", data: data
            }, function (err, result) {
                if (err) return false;

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);
                app.util.addStoreIdToStorage(result.data.id_store);

                // store is in a different section which requires page refresh
                window.location.href = "/store-admin/" + result.data.id_store  + "/dashboard";
            });

            return false;
        });



        // Submit register form
        $("#form-register").on("submit", function () {
            if (!$("#checkbox-tnc").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            var data = validate.collectFormValues($("#form-register")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.createUser))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/create-user", data: data
            }, function (err, result) {
                if (err) return;

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);

                $("#registration-success-email").text(data.email);
                self.showForm("#registration-success");
            });

            return false;
        });


        // Submit store application form
        $("#form-store-application").on("submit", function () {
            var data = validate.collectFormValues($("#form-store-application")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.storeApplication))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-application", data: data
            }, function (err) {
                if (err) return;

                $("#store-application-success-email").text(data.email);
                self.showForm("#store-application-success");
            });

            return false;
        });


        // Send forgot password email
        $("#form-forgot-password").on("submit", function () {
//            var email = validate.collectFormValues(this, { trim: true });
//
//            if (!app.util.validateInputs(email, app.validationRules.forgotPassword))
//                return false;
//
//            app.util.ajaxRequest({
//                method: "POST", url: "/api/v1/forgot-password", data: data
//            }, function (err, data) {
//                if (!err && data) {
//                    app.util.showToast(data.message, 4000);
//                }
//            });

            // TODO : fix
            app.util.showToast("not working just yet");

            return false;
        });


        // Registration success, go to acount page
        $("#registration-success-account").on("click", function () {
            var id_person = app.util.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.util.showToast("Error : Unable to go to account page");
            }
        });


        // Store application success, go to home page
        $("#store-application-success-home").on("click", function () {
            window.location.href = "/";
        });





        // ----------- Buttons -----------

        // login goto register
        $("#login-goto-register").on("click", function () {
            self.showForm("#form-register", true, true, "Register", "register");
        });


        // login goto store login
        $("#login-goto-store-login").on("click", function () {
            self.showForm("#form-store-login", true, false, "Store-login", "store-login");
        });


        // store login goto login
        $("#store-login-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // login goto store application
        $("#login-goto-store-application").on("click", function () {
            self.showForm("#form-store-application", true, true, "Store Application", "store-application");
        });


        // login goto forgot password
        $("#login-forgot-password").on("click", function () {
            self.showForm("#form-forgot-password");
        });


        // register goto login
        $("#register-goto-login").on("click", function () {
            $("#checkbox-tnc").prop("checked", false);
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // store application goto login
        $("#store-application-goto-login").on("click", function () {
            $("#checkbox-tnc-store").prop("checked", false);
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // forgot password goto login
        $("#forgot-password-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, "Register", "register");
        });


        $(window).on("resize", function () {
            self.updateFormVisuals();
        });


        setTimeout(function () {
            self.updateFormVisuals();

            // show form for route
            if (routeData.route == "/login") self.showForm("#form-login");
            if (routeData.route == "/store-login") self.showForm("#form-store-login");
            if (routeData.route == "/register") self.showForm("#form-register");
            if (routeData.route == "/store-application") self.showForm("#form-store-application");
        }, 500);

    },


    // Show a form
    showForm: function (formId, updateState, navbarActive, title, pushStateUrl) {
        $("#page-login .form-container-outer").addClass("hidden");
        var formContainer = $(formId).closest(".form-container-outer");
        formContainer.removeClass("hidden");

        if (updateState) {
            if (navbarActive) {
                $("#navbar-login").addClass("active");
            } else {
                $("#navbar-login").removeClass("active");
            }

            document.title = title;
            window.history.pushState(null, pushStateUrl, pushStateUrl);
        }

        $("html, body").animate({ "scrollTop": 100 }, 200);
    },


    // Update the form sizes and stuff
    updateFormVisuals: function () {
        $("#page-login form").each(function (index, el) {

            var height = el.clientHeight;
            var width = el.clientWidth;
            var container = $(el).closest(".form-container-outer");
            var siblings = $(el).siblings(".form-container-inner");

            $(container).css({ "height": height, "width": width });
            $(siblings[0]).css({ "height": height - 10, "width": width - 10 });
            $(siblings[1]).css({ "height": height - 10, "width": width - 10 });
        });
    },


}


// Site navbar
app.site.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);

        $(".navbar-links a").removeClass("active");

        // don't use blue underline thing on some routes
        var r = routeData.route;
        if (r.indexOf("/location/") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }


        // if logged in
        if (app.routerBase.isUserLoggedIn()) {
            $(".navbar-link-logout").show();
            $(".navbar-link-account").show();
            $(".navbar-link-login").hide();

            if (app.util.getStoreIdFromStorage()) {
                $(".navbar-link-dashboard").show();
            }
        } else {
            $(".navbar-link-login").show();
            $(".navbar-link-logout").hide();
            $(".navbar-link-account").hide();
            $(".navbar-link-dashboard").hide();
        }


        // suburb typeahead
        new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                app.routerBase.loadPageForRoute("/location/" + url, "site");
            }
        });


        // link clicked
        navbar.linkClicked = function (e, route) {
            if (e.target.innerText.toLowerCase() == "blog") {
                app.util.showToast("Not working yet");
                return false;
            }

            if (e.target.innerText.toLowerCase() == "account") {
                app.routerBase.loadPageForRoute("/account/" + app.util.getPersonIdFromStorage(), "site");
                return false;
            }

            if (e.target.innerText.toLowerCase() == "dashboard") {
                var sid = app.util.getStoreIdFromStorage();
                window.location.href = "/store-admin/" + sid + "/dashboard";
                return false;
            }

            app.routerBase.loadPageForRoute(route, "site");

            return false;
        };
    },

}
// Reset password page
app.site.resetPassword = {

    init: function () {
        var self = this;


        // get reset password token
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

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/reset-password", data: data
            }, function (err, result) {
                if (err) return;

                app.util.invalidateCredentialsAndGoToLogin();
            }, true);

            return false;
        });
    }
}

// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;


        app.storeContent.init(routeData);


        // Store id from url
        var id_store = routeData.route.split("/");
        id_store = id_store[id_store.length - 1];

        app.storeContent.id_store = id_store;


        // Get the store data
        app.storeContent.getStoreData(function (storeData) {
            if (storeData) {
                storeData.id_store = app.storeContent.id_store;
                app.storeContent.addStoreDetailsDataToPage(storeData);
                app.storeContent.addMenuDataToPage(storeData);
            }
        });
    },

}


// Verify Account page
app.site.verifyAccount = {

    init: function () {
        var self = this;


        // Get verification token
        this.verificationToken = window.location.search;
        if (!this.verificationToken || this.verificationToken.length < 30) {
            app.util.showToast("Invalid verification token", 4000);
            return;
        }

        this.verificationToken = this.verificationToken.substr(3, this.verificationToken.length);


        // Submit verify account form
        $("#form-verify-account").on("submit", function () {
            var data = validate.collectFormValues($("#form-verify-account")[0], { trim: true });

            data.verification_token = self.verificationToken;

            if (!app.util.validateInputs(data, app.validationRules.verifyAccount))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/verify-account", data: data
            }, function (err, result) {
                if (err) return;

                if (!result.data.jwt) alert("jwt missing");

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);

                $("#form-verify-account").addClass("hidden");
                $("#verify-account-success").removeClass("hidden");
            }, true);

            return false;
        });


        $("#verify-account-success-account").on("click", function () {
            var id_person = app.util.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.util.invalidateCredentialsAndGoToLogin();
            }
        });


        $("#verify-account-success-home").on("click", function () {
            window.location.href = "/";
        });
    }
}



// Business hours dialog
app.dialogs.businessHours = {

    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],


    init: function (storeHours) {
        var self = this;

        $("#dialog-store-hours-close").on("click", function () {
            self.hide();
        });
    },


    update: function (hours, hoursEl) {
        this.addHoursToList(storeHours.slice(0, 7), "#dialog-store-hours-left");
        this.addHoursToList(storeHours.slice(7, 14), "#dialog-store-hours-right");

        var text = "";
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 7; i++) {
            if (hours[i].opens === "c") {
                text = "closed";
            } else {
                text = hours[i].opens + " to " + hours[i].closes;
            }

            frag.append($("<li><span>" + this.days[i] + "</span> " + text + "</li>")[0]);
        }
        $(hoursEl).empty().append(frag);
    },


    show: function () {
        $("#dialog-container").show();
        $("#dialog-store-hours").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}

// Description dialog
app.dialogs.description = {


    init: function () {
        var self = this;

        $("#dialog-store-description-close").on("click", function () {
            self.hide();
        });
    },


    update: function (name, description) {
        $("#dialog-store-description-heading").text(name);
        $("#dialog-store-description-text").text(description);
    },


    show: function () {
        $("#dialog-container").show();
        $("#dialog-store-description").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}

// Reviews dialog
app.dialogs.reviews = {


    init: function (data) {
        var self = this;

        $("#dialog-store-reviews-add-review").on("click", function () {
            app.util.showToast("not working yet")
        });

        $("#dialog-store-reviews-close").on("click", function () {
            self.hide();
        });
    },


    update: function () {
        $("#dialog-store-reviews-count").text("( " + data.review_count + " )");

        app.controls.RatingControls.setValue("#dialog-store-reviews-rating-control",
            Math.round(data.rating));

        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.reviews.length; i++) {

            var ratingStars =
                "<li class='rating-control-star " + (data.reviews[i].rating > 0.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 1.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 2.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 3.5 ? "active" : "") + "'></li>" +
                "<li class='rating-control-star " + (data.reviews[i].rating > 4.5 ? "active" : "") + "'></li>";

            frag.append($(
                "<div class='store-reviews-list-item'>" +
                    "<div class='store-reviews-list-item-header'>" +
                        "<ul class='rating-control inactive'>" +
                            ratingStars +
                        "</ul>" +
                        "<label>" + data.reviews[i].title + "</label>" +
                    "</div>" +
                    "<p>" + data.reviews[i].review + "</p>" +
                "</div>")[0]);
        }
        $("#dialog-store-reviews-list").empty().append(frag);
    },


    show: function () {
        $("#dialog-container").show();
        $("#dialog-store-reviews").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}
if (typeof app === "undefined") {
    var app = {};
}

app.i18n = {};

// english
app.i18n.en = {
    storeIdMissing: "Store Id missing",
    imageFileMissing: "Image file missing",
    imageFileWrongType: "Incorrect image type.  Only Jpg is supported",
    imageFileTooBig: "Image file size too big.  Must be < 250kB",
}



// Base client side router
app.routerBase = {


    firstLoad: true,
    lastLoadedSection: "",


    // Init
    init: function () {
        var self = this;

        // For Cordova
        document.addEventListener("deviceready", function () {
            app.cordova.init();
        }, false);
    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;
        this.lastLoadedSection = section;


        // reset window events // TODO : test is working
        $(window).off();
        $(document).off();


        // for back button after pushstate
        window.onpopstate = function () {
            console.log("on popstate " + window.location.pathname)
            self.loadPageForRoute(window.location.pathname, self.lastLoadedSection, true);
        };


        // get data for route
        var routeData = this.getCurrentRouteData(route, section);


        // load html into page
        $("#page-container").empty();
        $("#page-container").append(routeData.html);

        $("html, body").animate({ "scrollTop": 0 }, 200);


        // start js
        app[section].routes[routeData.normalizedRoute].initFunction(routeData);
        app[section].onPageChanged(routeData);


        // run ui stuff when page is loaded
        setTimeout(function () {
            $("body").css("display", "block");

            // push route into history, but not on back
            if (!self.firstLoad && !isAfterPopState) {
                if (routeData.route != window.location.pathname) {
                    window.history.pushState(null, routeData.route, routeData.route);
                }
            }

            self.firstLoad = false;
        }, 0);


        document.title = routeData.title;

        return routeData;
    },




    // Returns the data for the current route
    getCurrentRouteData: function (route, section) {
        var route = route || window.location.pathname;
        var routeData = { route: route };

        if (app.util.isCordova()) {
            // remove extra cordova stuff from route
            route = route.substring(route.lastIndexOf("/"), route.length - 5);
            if (route == "/index-cordova") route = "/";
        }

        // normalize route and add current section
        routeData.normalizedRoute = app[section].normalizeRoute(route).route;
        routeData.section = section;

        // Add html and other route data
        if (app[section].routesList.indexOf(routeData.normalizedRoute) !== -1) {
            routeData.html = app[section].htmlFiles[routeData.normalizedRoute];
            $.extend(routeData, app[section].routes[routeData.normalizedRoute]);

        // unknown route
        } else {
            debugger;
            app.util.invalidateCredentialsAndGoToLogin();
            return;
        }

        return routeData;
    },



    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/logout", auth: true
        }, function (err) {
            app.util.invalidateCredentialsAndGoToLogin();

        });
    },



    // Get if the user is logged in
    isUserLoggedIn: function () {
        var jwt = app.util.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },

}




// Store content
// This is the details and menu sections used on the store page and edit store page
app.storeContent = {

    storeDataRequestNotAllowed: false,
    storeData: {},

    init: function (routeData, dataLoaded) {
        var self = this;

        this.$logo = $(".store-info-image");
        this.$address = $("#store-info-address");
        this.$storeMenuNav = $("#store-menu-nav");
        this.$description = $("#store-info-description");

        $(".store-info-image-empty").hide();
        $(".store-info-image-loading").show();


        this.id_store = app.util.getStoreIdFromStorage();


        // Open dialog buttons
        $("#store-info-button-description").on("click", function () {
            app.dialogs.description.show();
        });

        $("#store-info-button-hours").on("click", function () {
            app.dialogs.businessHours.show();
        });

        $("#store-info-button-reviews").on("click", function () {
            app.dialogs.reviews.show();
        });

    },


    // Show hide more button when description text changes height
    resizeDescription: function () {
        if (this.$description[0].scrollHeight > this.$description.innerHeight()) {
            $("#store-info-button-description").show();
        } else {
            $("#store-info-button-description").hide();
        }
    },


    // Add store details data
    addStoreDetailsDataToPage: function (data) {
        var self = this;


        // logo
        var logo = new Image();
        logo.src = "/res/storelogos/store" + this.id_store + ".jpg?" + Date.now();
        logo.onload = function () {
            $(".store-info-image-empty").hide();
            self.$logo.attr("src", logo.src);
            $(".store-info-image-loading").hide();
        }
        logo.onerror = function () {
            $(".store-info-image-loading").hide();
            $(".store-info-image-empty").show();
        }


        // Format address to a single string
        var address = data.address[0];
        address = address.street_address + " " +
            address.suburb + " " + address.postcode;


        // add store details
        $("#store-header-name").text(data.name);
        $("#store-info-description").text(data.description);
        $("#store-info-address").text(address);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-review-count").text("( " + data.review_count + " )");


        // rating control
        app.controls.RatingControls.setValue("#store-info-rating-control", Math.round(data.rating));


        // Events
        $(window).on("resize", function () {
            self.resizeDescription();
        });

    },



    // Add menu data
    addMenuDataToPage: function (data) {
        var self = this;

        // products
        var item = null;
        var itemProperties = "";
        var frag = document.createDocumentFragment();

        if (data.products) {

            // create product items
            for (var i = 0; i < data.products.length; i++) {
                item = data.products[i];

                // item template
                if (item.gluten_free) item.class1 = "label-gluten-free";
                if (item.vegetarian) item.class2 = "label-vegetarian";
                if (!item.delivery_available) item.class3 = "label-takeaway";

                var $item = $("<div></div>")
                    .loadTemplate($("#template-store-menu-item"), item);

                $item = $item.children().first();
                $item.attr("data-product-id", item.id_product);

                // click events
                $item.find(".store-menu-list-item-details").on("click", function () {
                    $(this).next().addClass("active");
                });

                $item.find(".store-menu-list-item-options-cancel").on("click", function () {
                    $(this).parent().removeClass("active");
                });

                frag.append($item[0]);
            }


            // create product heading items
            for (var i = 0; i < data.product_headings.length; i++) {
                var heading = data.product_headings[i];

                var el = $(frag).find(".store-menu-list-item[data-product-id='" +
                             heading.above_product_id + "']");

                if (el) {
                    var $item = $("<div></div>")
                        .loadTemplate($("#template-store-menu-heading"), heading);


                    $item = $item.children().first();
                    $item.attr("data-heading-id", heading.id_product_heading);
                    $item.insertBefore(el);
                }
            }


            // add products and headings to page
            $("#store-menu-list").append(frag);


            // Category scroller
            new app.controls.CategoryScroller(data.product_headings);


            // Setup dialogs
            app.dialogs.description.init(data.name, data.description);
            app.dialogs.businessHours.init(data.hours);
            app.dialogs.reviews.init(data);

        } else {
            $("#store-menu-list").append("No Products");
        }
    },


    // Gets the store data and caches it for a little while
    getStoreData: function (callback) {
        var self = this;
        if (this.storeDataRequestNotAllowed) {
            return callback(this.storeData);
        }

        if (!app.util.validateInputs({ id_store: this.id_store }, app.validationRules.getStore))
            return false;

        this.storeDataRequestNotAllowed = true;
        setTimeout(function () {
            self.storeDataRequestNotAllowed = false;
        }, 2000);

        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/store?id_store=" + this.id_store, cache: true
        }, function (err, result) {
            if (err) return;

            result.data.hours = result.data.hours[0];
            self.storeData = result.data; // cache storeData

            return callback(self.storeData);
        });
    },


}


if (typeof app === "undefined") {
    var app = {};
}


app.util = {



    // ---------------------- Stuff ----------------------


    // Validates an inputs object and shows toast if there's an error
    validateInputs: function (inputs, validationRule) {
        if (!validationRule) {
            console.log("validate rule undefined");
            return false;
        }

        var errors = validate(inputs, validationRule, { format: "flat" });
        if (errors && errors.length > 0) {
            this.showToast(errors[0]);
            return false;
        }

        return true;
    },


    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
    },


    // Show toast
    showToast: function (message, timeout, cssClass) {
        var $toasts = $("#toasts");
        var toast = $("<p class='" + (cssClass || "") + "'>" + message + "</p>");

        // remove toasts if there's too many stacked up
        if ($toasts.children().length >= 5) {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });
        }

        // append toasts message and show toasts
        $toasts.append(toast[0]);
        $toasts.show();

        $(toast).animate({ opacity: 1, bottom: 0 }, 100);

        // hide toast after a little bit
        var currentToast = setTimeout(function () {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });

            // hide container if it's empty
            if ($toasts.children().length === 0) {
                $toasts.hide().empty();
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


    // First letter of each word in a string to uppercase
    // https://stackoverflow.com/a/4878800
    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },






    // ---------------------- Credentials ----------------------

    // Add token to storage
    addJwtToStorage: function (token) {
        localStorage.setItem("jwt", token);
    },


    // Returns token from storage
    getJwtFromStorage: function () {
        return localStorage.getItem("jwt");
    },


    // Add person id to storage
    addPersonIdToStorage: function (id) {
        localStorage.setItem("pid", id);
    },


    // Returns person id from storage
    getPersonIdFromStorage: function () {
        return Number(localStorage.getItem("pid"));
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        return Number(localStorage.getItem("sid"));
    },


    // Replace current id and jwt with invalid ones
    invalidateCredentialsAndGoToLogin: function () {
        localStorage.removeItem("jwt");
        localStorage.removeItem("pid");
        localStorage.removeItem("sid");
        window.location.href = "/login";
    },



    // ---------------------- Ajax ----------------------


    // check if jwt from local storage is valid
    checkToken: function (callback) {
        var self = this;
        var jwt = this.getJwtFromStorage();

        if (jwt && jwt.length > 30) { // TODO : add a regex check or something

            this.ajaxRequest({
                method: "POST", url: "/api/v1/check-token", auth: true
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    self.invalidateCredentials();
                    return callback("invalid token");
                }

                self.addJwtToStorage(result.data.jwt);
                self.addPersonIdToStorage(result.data.id_person);
                if (result.data.id_store && result.data.id_store > 0) {
                    self.addStoreIdToStorage(result.data.id_store);
                }

                return callback(null);
            });
        } else {
            this.invalidateCredentials();
            return callback("invalid token");
        }
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


    // Upload an image
    uploadImage: function (files, callback) {
        var self = this;

        if (files && files.length > 0) {
            var file = files[0];
            if (file.size > 250000) {
                this.showToast("Image file size too big.  Must be < 250kB");
                return;
            }

            var formdata = new FormData();
            formdata.append("logo", files[0]);
            formdata.append("id_store", this.getStoreIdFromStorage());

            this.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-logo", auth: true,
                isImage: true, data: formdata
            }, function (err, result) {
                if (err || !result || !result.data || !result.data.url) {
                    console.log(err)
                    return callback("Error uploading image");
                }

                return callback(null, result.data.url);
            });


//            var imgEl = document.getElementById(imageEl);
//            var file = files[0];
//            console.log(imgEl, file)
//            var reader = new FileReader();
//            reader.onload = function (e) {
//                imgEl.src = e.target.result;
//            };
//            reader.readAsDataURL(file);
        } else {
            this.showToast("Invalid Image");
        }
    },



    // Generic ajax request
    // options are { method, url, data, auth, datatype, cache }, returns (err, data)
    ajaxRequest: function (options, callback) {
        var self = this;

        var contentType = "application/x-www-form-urlencoded; charser=UTF-8";
        if (options.isImage) contentType = false;

        // setup options
        var ajaxOptions = {
            method: options.method,
            url: options.url,
            data: options.data,
            cache: options.cache || false,
            processData: !options.isImage,
            contentType: contentType,
            beforeSend: function(request) {
                if (options.auth) {
                    request.setRequestHeader("authorization", "Bearer " + app.util.getJwtFromStorage());
                }
            },
            success: function (result) {
                return callback(null, result);
            },
            error: function (err) {
                console.log(err)
                if (err) {
                    if (err.responseJSON && err.responseJSON.err) {
                        self.showToast(err.responseJSON.err, 4000);
                    } else {
                        self.showToast("Server Error", 4000);
                    }
                }

                return callback(err);
            }
        }

        // set datatype
        if (options.dataType) {
            ajaxOptions.dataType = options.dataType;
        }

        // send request
        $.ajax(ajaxOptions);
    },

};


// Validation
// https://validatejs.org/

// these are related to the tables in server/sql
// and are used server and client side

// TODO : this file is a security issue, it shows the database structure pretty much
// split it into a file for each section


if (typeof app === "undefined") {
    var app = {};
}


// General shared validation rules
app.validationRules = {

    // for sequence id's such as id_store, id_adress, updated_by etc.
    _sequence_id: { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }},
    _sequence_id_optional: { numericality: { onlyInteger: true, greaterThan: 0 }},

    _email:                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }},
    _email_optional:        { email: true, length: { minimum: 3, maximum: 256 }},
    _phone_number:          { presence: true, length: { minimum: 3, maximum: 32 }},
    _phone_number_optional: { length: { minimum: 3, maximum: 32 }},
    _url_link:              { presence: true, length: { maximum: 256 }},
    _url_link_optional:     { length: { maximum: 256 }},
    _bit:                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }},
    _bit_optional:          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }},
    _notes_optional:        { length: { maximum: 256 }},
    _price:                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }},
    _price_optional:        { numericality: { greaterThanOrEqualTo: 0 }},
    _quantity:              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }},
    _latitude_optional:     { numericality: { greaterThanOrEqualTo: 0 }},
    _longitude_optional:    { numericality: { greaterThanOrEqualTo: 0 }},


    // These groups of validation things match the columns in the SQL tables
    // SQL table columns that aren't here are using the generic values above

    _addresses_street_address:               { presence: true, length: { maximum: 256 }},

    _people_first_name:                      { presence: true, length: { minimum: 2, maximum: 45 }},
    _people_first_name_optional:             { length: { minimum: 2, maximum: 45 }},
    _people_last_name:                       { presence: true, length: { minimum: 2, maximum: 45 }},
    _people_last_name_optional:              { length: { minimum: 2, maximum: 45 }},
    _people_password:                        { presence: true, length: { minimum: 3, maximum: 64 }},
    _people_reset_password_token:            { presence: true, length: 64 },
    _people_reset_password_token_optional:   { presence: true, length: 64 },
    _people_jwt:                             { presence: true, length: { minimum: 30, maximum: 512 }},
    _people_jwt_optional:                    { length: { minimum: 30, maximum: 512 }},
    _people_verification_token:              { presence: true, length: 64 },

    _postcodes_postcode:                     { presence: true, length: { minimum: 1, maximum: 6 }},
    _postcodes_suburb:                       { presence: true, length: { minimum: 1, maximum: 64 }},
    _postcodes_state:                        { presence: true, length: { minimum: 1, maximum: 32 }},

    _reviews_title:                          { presence: true, length: { minimum: 2, maximum: 128 }},
    _reviews_review_optional:                { length: { maximum: 512 }},
    _reviews_rating:                         { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }},

    _stores_name:                            { presence: true, length: { maximum: 512 }},
    _stores_description_optional:            { length: { maximum: 1024 }},
    _stores_abn:                             { presence: true, length: { minimum: 10, maximum: 32 }},
    _stores_bank_name:                       { presence: true, length: { minimum: 2, maximum: 128 }},
    _stores_bank_bsb:                        { presence: true, length: { minimum: 6, maximum: 16 }},
    _stores_bank_account_name:               { presence: true, length: { minimum: 2, maximum: 128 }},
    _stores_bank_account_number:             { presence: true, length: { minimum: 2, maximum: 32 }},
    _stores_hours:                           { length: { maximum: 5 }},

    _product_extras_name:                    { presence: true, length: { maximum: 128 }},

    _product_options_name:                   { presence: true, length: { maximum: 128 }},

    _products_name:                          { presence: true, length: { maximum: 128 }},
    _products_description_optional:          { length: { maximum: 256 }},

    _order_products_customer_notes_optional: { length: { maximum: 256 }},

    _orders_notes_optional:                  { length: { maximum: 256 }},
    _orders_expiry:                          { presence: true, datetime: true }, // TODO: does this work

    _transactions_commission:                { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }, // TODO : is 1000 ok
    _transactions_processing_fee:            { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } },

}







// These validation objects below use the values from above

// -------- Route validation --------


// Site - login page
app.validationRules.login = {
    email: app.validationRules._email,
    password: app.validationRules._people_password
}

app.validationRules.createUser = {
    first_name: app.validationRules._people_first_name,
    last_name: app.validationRules._people_last_name,
    email: app.validationRules._email,
    password: app.validationRules._people_password,
    confirmPassword: { equality: "password" }
}

app.validationRules.storeApplication = {
    name: { presence: true, length: { maximum: 128 }},
    email: app.validationRules._email,
    message: { length: { maximum: 256 }}
}

app.validationRules.forgotPassword = { email: app.validationRules._email }


// Site - verifiy account page
app.validationRules.verifyAccount = {
    email: app.validationRules._email,
    password: app.validationRules._people_password,
    verification_token: app.validationRules._people_verification_token
}


// Site - reset password page
app.validationRules.resetPassword = {
    email: app.validationRules._people_email,
    password: app.validationRules._people_password,
    confirmPassword: { equality: "password" },
    reset_password_token: app.validationRules._people_reset_password_token
}


// Tools app
app.validationRules.createStore = {
    postcode: app.validationRules._postcodes_postcode,
    suburb: app.validationRules._postcodes_suburb,
    street_address: app.validationRules._addresses_street_address,

    first_name: app.validationRules._people_first_name,
    last_name: app.validationRules._people_last_name,
    phone_number_user: app.validationRules._phone_number,
    email_user: app.validationRules._email,
    password: app.validationRules._people_password,

    name: app.validationRules._stores_name,
    abn: app.validationRules._stores_abn,
    internal_notes_store: app.validationRules._notes_optional
}

app.validationRules.deleteStore = {
	id_store: app.validationRules._sequence_id
}


// CMS - Details page
app.validationRules.updateStoreDetails = {
    description: app.validationRules._stores_description_optional,
    street_address: app.validationRules._addresses_street_address,
    postcode: app.validationRules._postcodes_postcode,
    suburb: app.validationRules._postcodes_suburb,
    phone_number: app.validationRules._phone_number,
    email: app.validationRules._phone_email,
    hours_mon_dinein_open: app.validationRules._stores_hours,
    hours_tue_dinein_open: app.validationRules._stores_hours,
    hours_wed_dinein_open: app.validationRules._stores_hours,
    hours_thu_dinein_open: app.validationRules._stores_hours,
    hours_fri_dinein_open: app.validationRules._stores_hours,
    hours_sat_dinein_open: app.validationRules._stores_hours,
    hours_sun_dinein_open: app.validationRules._stores_hours,
    hours_mon_dinein_close: app.validationRules._stores_hours,
    hours_tue_dinein_close: app.validationRules._stores_hours,
    hours_wed_dinein_close: app.validationRules._stores_hours,
    hours_thu_dinein_close: app.validationRules._stores_hours,
    hours_fri_dinein_close: app.validationRules._stores_hours,
    hours_sat_dinein_close: app.validationRules._stores_hours,
    hours_sun_dinein_close: app.validationRules._stores_hours,
    hours_mon_delivery_open: app.validationRules._stores_hours,
    hours_tue_delivery_open: app.validationRules._stores_hours,
    hours_wed_delivery_open: app.validationRules._stores_hours,
    hours_thu_delivery_open: app.validationRules._stores_hours,
    hours_fri_delivery_open: app.validationRules._stores_hours,
    hours_sat_delivery_open: app.validationRules._stores_hours,
    hours_sun_delivery_open: app.validationRules._stores_hours,
    hours_mon_delivery_close: app.validationRules._stores_hours,
    hours_tue_delivery_close: app.validationRules._stores_hours,
    hours_wed_delivery_close: app.validationRules._stores_hours,
    hours_thu_delivery_close: app.validationRules._stores_hours,
    hours_fri_delivery_close: app.validationRules._stores_hours,
    hours_sat_delivery_close: app.validationRules._stores_hours,
    hours_sun_delivery_close: app.validationRules._stores_hours
}


// Used in store-content.js
app.validationRules.getStore = {
    id_store: app.validationRules._sequence_id
}


// Validates a business hours object
// checks time is HH:MM and gives if only one open/close time is null
app.validationRules.validateHours = function (data) {
    if (!data || Object.keys(data).length === 0) {
        return "Data missing";
    }

    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("hours_") === 0) {

            if (data[keys[i]]) {
                if (data[keys[i]].length !== 5 || !data[keys[i]].match(/\d{2}:\d{2}/)) {
                    var temp = keys[i].split("_");
                    var text = temp[1] + " " + temp[2] + " " + temp[3];
                    text = app.util.toTitleCase(text);
                    return "Error in Hours " + text + ".  Must be HH:MM";
                }

            // both times have to be null
            } else {
                var temp = keys[i].split("_");
                var check = temp[3] === "open" ? "close" : "open";

                var text = temp[1] + " " + temp[2] + " " + temp[3];
                text = app.util.toTitleCase(text);
                temp = temp[0] + "_" + temp[1] + "_" + temp[2] + "_" + check;

                if (data[temp]) { // check matching time
                    return "Error in Hours " + text + ".  Open and Close must be both times or both closed";
                }
            }
        }
    }

    return null;
}






//app.validationRules.storeUpdateBankDetails = {
//    bank_name: app.validationRules._stores_bank_name,
//    bank_bsb: app.validationRules._stores_bank_bsb,
//    bank_account_name: app.validationRules._stores_bank_account_name,
//    bank_account_number: app.validationRules._stores_bank_account_number
//}







// Scroller on store and cms menu pages
app.controls.CategoryScroller = function (categories) {

    var scrollerListEl = ".category-scroller-list";
    var $categoryScrollerContainer = $(".category-scroller-container");
    var $categoryScroller = $(".category-scroller");
    var $categoryScrollerList = $(scrollerListEl);


    // Add items to scroller
    var frag = document.createDocumentFragment();
    for (var i = 0; i < categories.length; i++) {
        var $item = $("<li class='store-menu-nav-list-item'>" + categories[i].title + "</li>");

        // Item clicked event
        $item.on("click", function (e) {
            var el = $(".store-menu-list-item-group-heading:contains('" + e.target.innerText + "')");

            if (el[0]) {
                $("html").animate({ scrollTop: el[0].offsetTop - 30 }, 500);
            }
        });

        frag.append($item[0]);
    }
    $categoryScrollerList.append(frag);


    // top category nav
    new app.controls.HorizontalScroller(scrollerListEl, function (clickedEl) {

    });


    // Change to floating navbar
    $(window).on("scroll", function (e) {
        if ($categoryScrollerContainer[0].getBoundingClientRect().top < 20) {
            $categoryScroller.addClass("floating");
        } else {
            $categoryScroller.removeClass("floating");
        }
    });
}
// Navbar

app.controls.Navbar = function (routeData) {
    var self = this;


    // Item clicked
    $(".navbar a").on("click", function (e) {
        if (this.innerText.toLowerCase() == "logout") {
            app.routerBase.logUserOut();
            return false;
        }

        var route = this.href.replace(window.location.origin, "");
        self.linkClicked(e, route);

        return false;
    });


    // Popup icon to show/hide
    $(".navbar-links-popup-button").on("click", function () {
        $(".navbar-links-popup").animate({ right: 0 }, 200);
    });

    $(".navbar-links-popup-close").on("click", function () {
        $(".navbar-links-popup").animate({ right: -250 }, 200);
    });


    // TODO : remove in production
    // Debug - go to sysadmin page when click on the icon
    $(".navbar-icon").on("click", function (e) {
        if (e.ctrlKey) {
            window.location.href = "/admin-login";
        } else {
            window.location.href = "/location/Balmoral-4171";
        }
    });
}

// Overridden elsewhere
app.controls.Navbar.prototype.linkClicked = function () { }

// Sets up multiple rating controls
app.controls.RatingControls = {


    // Sets the value of a rating control
    setValue: function (controlEl, rating) {
        var el = $(controlEl);

        for (var j = 0; j < rating; j++) {
            el.children().eq(j).addClass("active");
        }
    },


    // Returns the current rating value from a rating control
    getValue: function (formEl) {
        return $(formEl + " .rating-control-star.active").length;
    },



    // update current user rating controls
    updateRatingControls: function (ratings) {
        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].id_review) {
                var ratingControl = $(".rating-control-stars.user[data-id='" + ratings[i].id_review + "']");

                for (var j = 0; j < ratings[i].rating; j++) {
                    ratingControl.children().eq(j).addClass("active");
                }
            }
        }
    },


    // Adds click events to all the rating controls
    // bit easier to do it this way when there's not many reviews
    recreateRatingControlEvents: function () {
        var self = this;
        $(".rating-control-star").off();
        $(".rating-control-star").unbind();


        // has the user used this star control before
        var isUnused = false;


        // Rating control star clicked
        $(".rating-control-star").on("click", function () {
            if (!$(this).hasClass("active") && !$(this).siblings().hasClass("active")) {
                isUnused = true;
            }

            $(this).removeClass("active");
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            $(this).prevAll().addClass("active");
        });



// TODO : what's this ??
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

    },

}

// Horizontal scroller
app.controls.HorizontalScroller = function (containerEl, clickCallback) {

    var mouseIsDown = false;
    var startMouseX = 0;
    var startPosX = 0;
    var currentX = 0;

    // start
    $(containerEl).on("mousedown", function (e) {
        mouseIsDown = true;
        startMouseX = e.clientX;
        startPosX = $(this).scrollLeft();
    });


    // scrolling
    $(window).on("mousemove", function (e) {
        if (mouseIsDown) {
            e.stopPropagation();
            $(containerEl).scrollLeft(startPosX - (e.clientX - startMouseX));
        }
    });

    // stop
    $(window).on("mouseup", function (e) {
        mouseIsDown = false;
    });


    // click callback if mouse doesn't move much
    $(containerEl).on("mouseup", function (e) {
        var diff = e.clientX - startMouseX;

        if (diff >= -4 && diff <= 4) {
            clickCallback(e.target);
        }
    });
}
// Creates a suburb typeahead control
app.controls.Typeahead = function (callback) {
    var self = this;

    this.$typeaheadInput = $("#typeahead-suburb-search");
    this.$typeaheadList = $("#typeahead-suburb-list");

    var lookupTimeout = 500;
    var typeaheadTimeout = null;

    this.baseUrl = "/api/v1/location?q=";


    // when a dropdown item is selected return data and url
    function selectItem (el) {
        var data = {
            suburb: $(el).find(".typeahead-item-suburb").text(),
            postcode: $(el).find(".typeahead-item-postcode").text()
        };

        self.$typeaheadList.hide();

        self.$typeaheadInput.attr("data-suburb", "");
        self.$typeaheadInput.attr("data-postcode", "");

        if (!data.suburb || !data.postcode) {
            return callback(null);
        }

        self.setValue(data.postcode, data.suburb);

        var encodedUrl = encodeURIComponent(data.suburb + "-" + data.postcode);
        return callback(data, encodedUrl);
    }


    // list item clicked
    this.$typeaheadList.on("click", function (e) {
        selectItem(e.target);
    });


    // input focused
    this.$typeaheadInput.on("focus", function () {
        this.setSelectionRange(0, this.value.length);
    });


    // input blurred
    this.$typeaheadInput.on("blur", function () {
        var data = self.getValue();

        if (data.suburb && data.postcode) {
            console.log("1")
            self.setValue(data.postcode, data.suburb);
        } else {
            self.$typeaheadInput.attr("data-suburb", "");
            self.$typeaheadInput.attr("data-postcode", "");
            self.$typeaheadInput.val("");
        }
    });


    // when typing, generate dropdown list
    this.$typeaheadInput.on("keyup", function (e) {
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
                self.$typeaheadList.hide();
                return;
            }

            // get locations from server
            var url = self.baseUrl + value;
            app.util.ajaxRequest({
                method: "GET", url: url
            }, function (err, result) {
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

                self.$typeaheadList.empty();

                // add list items
                if (listItems.length > 0) {
                    self.$typeaheadList.append(listItems.join(""));
                    self.$typeaheadList.show();
                } else {
                    self.$typeaheadList.show();
                    self.$typeaheadList.append(
                        "<li class='typeahead-item'>NO RESULTS</li>");
                }
            });
        }, lookupTimeout);
    });


    // hide when click outside control
    $(window).on("mousedown", function (e) {
        if (e.target.className != "typeahead-item") {
            self.$typeaheadList.hide();
        }
    });


    // hide when esc is presed
    $(window).on("keydown", function (e) {
        if (e.which == 27) {
            self.$typeaheadList.hide();
        }
    });

}


// Set the value of the typeahead
app.controls.Typeahead.prototype.setValue = function (postcode, suburb) {
    this.$typeaheadInput.val(postcode + " - " + suburb);
    this.$typeaheadInput.attr("data-suburb", suburb);
    this.$typeaheadInput.attr("data-postcode", postcode);
}


// Get the value of the typeahead
app.controls.Typeahead.prototype.getValue = function () {
    return {
        suburb: this.$typeaheadInput.attr("data-suburb"),
        postcode: this.$typeaheadInput.attr("data-postcode")
    };
}
