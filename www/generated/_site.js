"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};


if (typeof window != "undefined") {
    $(document).ready(function () {
        app.site.init();
    });
}


// Site pages
app.site = {


    htmlFiles: {}, // cached html


    init: function () {
        var self = this;

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);


        app.routerBase.init();


        // Load the html json file
        $.getJSON("/generated/_site.json", function (data) {
            self.htmlFiles = data;

            var routeData = app.routerBase.loadPageForRoute(null, "site");

        }).fail(function (err) {
            // TODO : error msg
        });
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.navbar.init(routeData);
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

        app.util.validateJwt(function (err) {
            if (err) {
                window.location.href = "/login";
            }

            self.afterInit();
        });

    },


    // After init
    afterInit: function () {

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

// Business hours dialog
app.dialogs.businessHours = {

    dialogEl: "#dialog-store-hours",
    hoursLeftEl: "#dialog-store-hours-left",
    hoursRightEl: "#dialog-store-hours-right",
    dialogCloseEl: "#dialog-store-hours-close",

    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],

    init: function (storeHours) {
        var self = this;

        this.addHoursToList(storeHours.dineIn, this.hoursLeftEl);
        this.addHoursToList(storeHours.delivery, this.hoursRightEl);

        $(this.dialogCloseEl).off().on("click", function () {
            self.hide();
        });
    },

    addHoursToList: function (hours, hoursEl) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 7; i++) {
            frag.append($("<li><span>" + this.days[i] + "</span> " + hours[i] + "</li>")[0]);
        }
        $(hoursEl).empty().append(frag);
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

// Description dialog
app.dialogs.description = {

    dialogEl: "#dialog-store-description",
    dialogHeading: "#dialog-store-description-heading",
    dialogText: "#dialog-store-description-text",
    dialogCloseEl: "#dialog-store-description-close",

    init: function (name, description) {
        var self = this;

        $(this.dialogHeading).text(name);
        $(this.dialogText).text(description);

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

// Reviews dialog
app.dialogs.reviews = {

    dialogEl: "#dialog-store-reviews",
    dialogCloseEl: "#dialog-store-reviews-close",
    reviewCountEl: "#dialog-store-reviews-count",

    init: function (data) {
        var self = this;

        $(this.reviewCountEl).text("( " + data.review_count + " )");
        app.ratingControls.setValue("#dialog-store-reviews-rating-control", Math.round(data.rating));

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
        $("#dialog-store-reviews-list").append(frag);


        $("#dialog-store-reviews-add-review").on("click", function () {
            app.util.showToast("not working yet")
        });

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
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
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


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
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


        setTimeout(function () {
            self.resizeLocationHeading();
        }, 100);


        setTimeout(function () { // again just incase
            self.resizeLocationHeading();
        }, 1000);
    },

}
// Login, register, store-login, store application etc
app.site.login = {


    registeredIdPerson: 0,


    init: function (routeData) {
        var self = this;

        // cached incase the user wants to resend the verification
        // email from the registration success thing
        var registrationData = undefined;




        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/login", data, function (err, result) {
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

            app.util.ajaxRequest("POST", "/api/v1/store-login", data, function (err, result) {
                if (err) return false;

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);
                app.util.addStoreIdToStorage(result.data.id_store);

                // store is in a different section which requires page refresh
                window.location.href = "/store/" + result.data.id_store  + "/dashboard";
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

            if (!app.util.validateInputs(data, app.validationRules.peopleCreate))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/register", data, function (err, result) {
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
            if (!$("#checkbox-tnc-store").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-store-application")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.registerStore))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/store-application", registrationData, function (err) {
                if (err) return;

                //$("#registration-success-email").text(registrationData.email);
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


        // Registration success, go to acount page
        $("#registration-success-account").on("click", function () {
            var id_person = app.util.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.util.showToast("Error : Unable to go to account page");
            }
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


// Reset password page
app.site.resetPassword = {

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

// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;

        this.descriptionEl = $("#store-info-description");
        this.storeMenuNavEl = $("#store-menu-nav");


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
        });


        // Get store data
        app.util.ajaxRequest("GET", "/api/v1/store", { id_store: 1 }, function (err, result) {
            if (err) return console.log(err);
console.log(result)
            if (Object.keys(result).length > 0) {
                self.addDataToPage(result.data[0]);
            } else {
                app.util.showToast("Error loading store data");
            }
        });


        // Other events
        $(window).on("resize", function () {
            self.resizeDescription();
        });


        $(window).on("scroll", function (e) {
            // position of menu category navigation thing
            var rect = document.getElementById("store-menu").getBoundingClientRect();
            if (rect.top < 0) {
                self.storeMenuNavEl.css({ "position": "fixed", "right": 70, "top": 0, "float": "none" });
            } else {
                self.storeMenuNavEl.css({ "position": "relative", "right": "auto", "top": "auto", "float": "left" });
            }
        });


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
        if (this.descriptionEl[0].scrollHeight > this.descriptionEl.innerHeight()) {
            $("#store-info-button-description").show();
        } else {
            $("#store-info-button-description").hide();
        }
    },


    // add data to the page
    addDataToPage: function (data) {
console.log(data)

        var address = data.address[0];
        address = address.line1 + ", " +
            (address.line2 ? (address.line2 + ", ") : "") +
            address.suburb + " " + address.postcode

        $("#store-header-name").text(data.name);
        $("#store-info-image").attr("src", data.logo);
        $("#store-info-description").text(data.description);
        $("#store-info-address").text(address);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-review-count").text("( " + data.review_count + " )");

        app.controls.ratingControls.setValue("#store-info-rating-control", Math.round(data.rating));

        // products
        var item = null;
        var itemProperties = "";
        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.products.length; i++) {

            // product category heading
            frag.append(
                $("<div class='store-menu-list-item heading'>" +
                    "<h4 class='store-menu-list-item-group-heading'>" + data.products[i].name + "</h4>" +
                    "<hr class='hr-1' />" +
                "</div>")[0]);

            // product items
            for (var j = 0; j < data.products[i].items.length; j++) {
                item = data.products[i].items[j];

                itemProperties = "";
                if (item.gluten_free) itemProperties += "<label class='label-gluten-free'>GLUTEN FREE</label>";
                if (item.vegetarian) itemProperties += "<label class='label-vegetarian'>VEGETARIAN</label>";
                if (!item.delivery) itemProperties += "<label class='label-takeaway'>DELIVERY NOT AVAILABLE</label>";

                if (!itemProperties) itemProperties = "<br />";

                frag.append(
                    $("<div class='store-menu-list-item clearfix'>" +
                        "<div>" +
                            "<h4>" + item.title + "</h4>" +
                            "<p>" + item.description + "</p>" +
                            itemProperties +
                        "</div>" +
                        "<label>Add to order</label>" +
                    "</div>")[0]);
            }
        }

        $("#store-menu-list").append(frag);


        // Category nav
        frag = document.createDocumentFragment();
        for (var i = 0; i < data.products.length; i++) {
            frag.append($("<li class='store-menu-nav-list-item'>" + data.products[i].name + "</li>")[0])
        }
        $("#store-menu-nav-list").append(frag);

        $(".store-menu-nav-list-item").on("click", function (e) {
            var el = $(".store-menu-list-item-group-heading:contains('" + e.target.innerText + "')");

            $("html").animate({ scrollTop: el[0].offsetTop }, 500);
        });


        // Checkout




        // Setup dialogs
        app.dialogs.description.init(data.name, data.description);
        app.dialogs.businessHours.init(data.hours);
        app.dialogs.reviews.init(data);

        $("#store-info-button-hours").show();
        $("#store-info-button-reviews").show();

        this.resizeDescription();
    },

}


// Verify Account page
app.site.verifyAccount = {

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

                window.location.href = "/";
            }, true);

            return false;
        });
    }
}
// ?t=7h5GAbJWWfGBrPtEXk2DeAIA2rYC49GB6n6xVCUwwGpo0emkE3

app.navbar = {


    // Init
    init: function (routeData) {
        var self = this;

        // Item clicked
        $(".navbar a").on("click", function () {
            if (this.innerText.toLowerCase() == "blog") {
                app.util.showToast("Not working yet");
                return false;
            }

            if (this.innerText.toLowerCase() == "account") {
                app.routerBase.loadPageForRoute("/account/" + app.util.getPersonIdFromStorage(), "site");
                return false;
            }

            if (this.innerText.toLowerCase() == "logout") {
                app.routerBase.logUserOut();
                return false;
            }

            var route = this.href.replace(window.location.origin, "");

            var routeData = app.routerBase.loadPageForRoute(route, "site");

            return false;
        });


        // Popup icon to show/hide
        $(".navbar-links-popup-button").on("click", function () {
            $(".navbar-links-popup").animate({ right: 0 }, 200);
        });

        $(".navbar-links-popup-close").on("click", function () {
            $(".navbar-links-popup").animate({ right: -200 }, 200);
        });


        // TODO : remove in production
        // Debug - go to sysadmin page when click on the icon
        $(".navbar-icon").on("click", function (e) {
            if (e.ctrlKey) {
                window.location.href = "/sysadmin/create-store";
            } else {
                window.location.href = "/location/Balmoral-4171";
            }
        });

        this.updateNavbar(routeData);
    },


    // Update the navbar when the route changes
    updateNavbar: function (routeData) {
        var r = routeData.route;

        $(".navbar-links a").removeClass("active");

        if (r.indexOf("/location/") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }

        // if logged in
        if (app.routerBase.isUserLoggedIn()) {
            $(".navbar-link-dashboard").show();
            $(".navbar-link-logout").show();
            $(".navbar-link-account").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
            $(".navbar-link-logout").hide();
            $(".navbar-link-account").hide();
        }
    }


}

// Base client side router
app.routerBase = {


    // url regexes
    regexUrlStore: /\/store\/\d*/,
    regexUrlAccount: /\/account\/\d*/,
    regexUrlLocation: /\/location\/[\w\d%-]*-\d*/,
    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,

    firstLoad: true,
    lastSection: "",


    // Init
    init: function () {
        var self = this;

        // For Cordova
        document.addEventListener("deviceready", function () {
            app.cordova.init();
        }, false);

        // for back button after pushstate
        window.onpopstate = function () {
            self.loadPageForRoute(window.location.pathname, self.lastSection, true);
        };
    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;
        this.lastSection = section;


        // get data for route
        var routeData = this.getCurrentRouteData(route, section);


        // load html into page
        $("#page-container").empty();
        $("#page-container").append(routeData.html);


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

        // replace variables with placeholders
        if (this.regexUrlStoreAdmin.exec(route)) {
            var temp = route.split("/");
            route = "/store-admin/:id/" + temp[temp.length - 1];
        } else if (this.regexUrlStore.exec(route)) {
            route = "/store/:id";
        } else if (this.regexUrlLocation.exec(route)) {
            route = "/location/:suburb";
        } else if (this.regexUrlAccount.exec(route)) {
            route = "/account/:id";
        }

        routeData.normalizedRoute = route;
        routeData.section = section;

        // Add html and other route data
        if (app[section].routesList.indexOf(route) !== -1) {
            routeData.html = app[section].htmlFiles[route];
            $.extend(routeData, app[section].routes[route]);

        // unknown route
        } else {
            window.location.href = "/login";
            return;
        }

        return routeData;
    },



    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        app.util.ajaxRequest("GET", "/api/v1/logout", { auth: true }, function (err) {
            if (err) return;

            app.util.invalidateCredentials();
            window.location.href = "/login";
        });
    },



    // Get if the user is logged in
    isUserLoggedIn: function () {
        var jwt = app.util.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },

}


app.util = {



    // ---------------------- Stuff ----------------------



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


    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
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
        return localStorage.getItem("pid");
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        return localStorage.getItem("sid");
    },


    // Replace current id and jwt with invalid ones
    invalidateCredentials: function () {
        localStorage.setItem("jwt", "invalidToken");
        localStorage.setItem("pid", "");

        if (localStorage.getItem("sid") || localStorage.getItem("sid") === null) {
            localStorage.setItem("sid", "");
        }
    },



    // ---------------------- Ajax ----------------------


    // check if jwt from local storage is valid
    validateJwt: function (callback) {
        var self = this;
        var jwt = this.getJwtFromStorage();

        if (jwt && jwt.length > 30) {

            app.util.ajaxRequest("POST", "/api/v1/check-token", { auth: true }, function (err, result) {
                if (err) {
                    console.log(err);
                    self.invalidateCredentials();
                    return callback("invalid token");
                }

                self.addJwtToStorage(result.data.jwt);
                self.addPersonIdToStorage(result.data.id_person);

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


    // Generic ajax request - returns (err, data)
    ajaxRequest: function (type, url, data, callback) {
        var self = this;
        var auth = false;
        if (data) {
            auth = data.auth == true;
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

// General shared validation rules

if (typeof app === "undefined") {
    var app = {};
}

app.vr = {};

// for sequence id's such as id_store, id_adress, updated_by etc.
app.vr._sequence_id = { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
app.vr._sequence_id_optional = { numericality: { onlyInteger: true, greaterThan: 0 }};

app.vr._email =                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }};
app.vr._email_optional =        { email: true, length: { minimum: 3, maximum: 256 }};
app.vr._phone_number =          { presence: true, length: { minimum: 3, maximum: 32 }};
app.vr._phone_number_optional = { length: { minimum: 3, maximum: 32 }};
app.vr._url_link =              { presence: true, length: { maximum: 256 }};
app.vr._url_link_optional =     { length: { maximum: 256 }};
app.vr._bit =                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
app.vr._bit_optional =          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
app.vr._notes_optional =        { length: { maximum: 256 }};
app.vr._price =                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }};
app.vr._price_optional =        { numericality: { greaterThanOrEqualTo: 0 }};
app.vr._quantity =              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
app.vr._latitude_optional =     { numericality: { greaterThanOrEqualTo: 0 }};
app.vr._longitude_optional =    { numericality: { greaterThanOrEqualTo: 0 }};


// these groups of validation things match the values in the sql tables
// values not here are using the generic values above

app.vr._addresses_line1 =          { presence: true, length: { maximum: 128 }};
app.vr._addresses_line2_optional = { length: { maximum: 128 }};

app.vr._people_first_name =                    { presence: true, length: { minimum: 2, maximum: 45 }};
app.vr._people_first_name_optional =           { length: { minimum: 2, maximum: 45 }};
app.vr._people_last_name =                     { presence: true, length: { minimum: 2, maximum: 45 }};
app.vr._people_last_name_optional =            { length: { minimum: 2, maximum: 45 }};
app.vr._people_password =                      { presence: true, length: { minimum: 3, maximum: 64 }};
app.vr._people_reset_password_token =          { presence: true, length: 64 };
app.vr._people_reset_password_token_optional = { presence: true, length: 64 };
app.vr._people_jwt =                           { presence: true, length: { minimum: 30, maximum: 512 }};
app.vr._people_jwt_optional =                  { length: { minimum: 30, maximum: 512 }};
app.vr._people_verification_token =            { presence: true, length: 64 };

app.vr._postcodes_postcode = { presence: true, length: { minimum: 1, maximum: 6 }};
app.vr._postcodes_suburb =   { presence: true, length: { minimum: 1, maximum: 64 }};
app.vr._postcodes_state =    { presence: true, length: { minimum: 1, maximum: 32 }};

app.vr._business_hours_day =    { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 8 }};
app.vr._business_hours_opens =  { presence: true, length: { maximum: 8 }};
app.vr._business_hours_closes = { presence: true, length: { maximum: 8 }};

app.vr._reviews_title =           { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._reviews_review_optional = { length: { maximum: 512 }};
app.vr._reviews_rating =          { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }};

app.vr._stores_logo =                 { presence: true, length: { maximum: 256 }};
app.vr._stores_name =                 { presence: true, length: { maximum: 512 }};
app.vr._stores_description_optional = { length: { maximum: 1024 }};
app.vr._stores_abn =                  { presence: true, length: { minimum: 10, maximum: 32 }};
app.vr._stores_bank_name =            { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._stores_bank_bsb =             { presence: true, length: { minimum: 6, maximum: 16 }};
app.vr._stores_bank_account_name =    { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._stores_bank_account_number =  { presence: true, length: { minimum: 2, maximum: 32 }};
app.vr._stores_hours =                { presence: true, length: { minimum: 4, maximum: 5 }};

app.vr._product_extras_name = { presence: true, length: { maximum: 128 }};

app.vr._product_options_name = { presence: true, length: { maximum: 128 }};

app.vr._products_name =                 { presence: true, length: { maximum: 128 }};
app.vr._products_description_optional = { length: { maximum: 256 }};

app.vr._order_products_customer_notes_optional = { length: { maximum: 256 }};

app.vr._orders_notes_optional = { length: { maximum: 256 }};
app.vr._orders_expiry =         { presence: true, datetime: true }; // TODO: does this work ?

app.vr._transactions_commission =     { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }; // TODO : is 1000 ok ?
app.vr._transactions_processing_fee = { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } };









// These validation objects below use the values from above

// -------- Auth route validation --------


app.vr.login = {
    email: app.vr._email,
    password: app.vr._people_password
}

app.vr.storeLogin = {
    email: app.vr._email,
    password: app.vr._people_password
}

app.vr.createUser = {
    first_name: app.vr._people_first_name,
    last_name: app.vr._people_last_name,
    email: app.vr._email,
    password: app.vr._people_password,
    confirmPassword: { equality: "password" }
}

app.vr.verifyAccount = {
    email: app.vr._email,
    password: app.vr._people_password,
    verification_token: app.vr._people_verification_token
}

app.vr.logout = {
    jwt: app.vr._people_jwt
}

app.vr.sendRegistrationEmail = { email: app.vr._email }

app.vr.forgotPassword = { email: app.vr._email }

app.vr.resetPassword = {
    email: app.vr._people_email,
    password: app.vr._people_password,
    confirmPassword: { equality: "password" },
    reset_password_token: app.vr._people_reset_password_token
}

app.vr.checkJwt = {
    jwt: app.vr._people_jwt
}




// -------- Store route validation --------

app.vr.createStore = {
    postcode: app.vr._postcodes_postcode,
    suburb: app.vr._postcodes_suburb,

    address_line_1: app.vr._addresses_line1,
    address_line_2: app.vr._addresses_line2_optional,

    first_name: app.vr._people_first_name,
    last_name: app.vr._people_last_name,
    email_user: app.vr._email,
    phone_number_user: app.vr._phone_number,
    password: app.vr._people_password,
    internal_notes_user: app.vr._notes_optional,

    logo: app.vr._stores_logo,
    name: app.vr._stores_name,
    description: app.vr._stores_description_optional,
    email_store: app.vr._email,
    phone_number_store: app.vr._phone_number,
    website: app.vr._url_link_optional,
    facebook: app.vr._url_link_optional,
    twitter: app.vr._url_link_optional,
    abn: app.vr._stores_abn,
    internal_notes_store: app.vr._notes_optional,
    bank_name: app.vr._stores_bank_name,
    bank_bsb: app.vr._stores_bank_bsb,
    bank_account_name: app.vr._stores_bank_account_name,
    bank_account_number: app.vr._stores_bank_account_number,

    hours_mon_dinein_open: app.vr._stores_hours,
    hours_tue_dinein_open: app.vr._stores_hours,
    hours_wed_dinein_open: app.vr._stores_hours,
    hours_thu_dinein_open: app.vr._stores_hours,
    hours_fri_dinein_open: app.vr._stores_hours,
    hours_sat_dinein_open: app.vr._stores_hours,
    hours_sun_dinein_open: app.vr._stores_hours,
    hours_mon_dinein_close: app.vr._stores_hours,
    hours_tue_dinein_close: app.vr._stores_hours,
    hours_wed_dinein_close: app.vr._stores_hours,
    hours_thu_dinein_close: app.vr._stores_hours,
    hours_fri_dinein_close: app.vr._stores_hours,
    hours_sat_dinein_close: app.vr._stores_hours,
    hours_sun_dinein_close: app.vr._stores_hours,
    hours_mon_delivery_open: app.vr._stores_hours,
    hours_tue_delivery_open: app.vr._stores_hours,
    hours_wed_delivery_open: app.vr._stores_hours,
    hours_thu_delivery_open: app.vr._stores_hours,
    hours_fri_delivery_open: app.vr._stores_hours,
    hours_sat_delivery_open: app.vr._stores_hours,
    hours_sun_delivery_open: app.vr._stores_hours,
    hours_mon_delivery_close: app.vr._stores_hours,
    hours_tue_delivery_close: app.vr._stores_hours,
    hours_wed_delivery_close: app.vr._stores_hours,
    hours_thu_delivery_close: app.vr._stores_hours,
    hours_fri_delivery_close: app.vr._stores_hours,
    hours_sat_delivery_close: app.vr._stores_hours,
    hours_sun_delivery_close: app.vr._stores_hours
}

app.vr.getStore = {
    id_store: app.vr._sequence_id
}




// alias
app.validationRules = app.vr;



app.controls.ratingControls = {


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
app.controls.TabControl = function (tabcontrolEL, clickCallback) {

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

        var action = $(tabItemEls[clickedTabIndex]).data("id");
        return clickCallback(action);
    });

}
// Creates a typeahead control
app.controls.Typeahead = function (inputEl, listEl, itemList, callback) {
    var typeaheadList = $(listEl);

    var typeaheadTimeout = null;


    // when a dropdown item is selected
    function selectItem (el) {
        var result = {
            suburb: encodeURIComponent($(el).find(".typeahead-item-suburb").text()),
            postcode: $(el).find(".typeahead-item-postcode").text()
        };

        $(listEl).prev().val(result.postcode + " - " + result.suburb); // put selected item into input
        $(listEl).hide();

        return callback(result);
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

