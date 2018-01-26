"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};


if (typeof window != "undefined") {
    $(document).ready(function () {
        app.sysadmin.init();
    });
}


// Sysadmin
app.sysadmin = {

    htmlFiles: {}, // cached html


    init: function (routeData) {
        var self = this;

        app.routerBase.init();

        // Load the html json file
        $.getJSON("/generated/_sysadmin.json", function (data) {
            self.htmlFiles = data;

            app.routerBase.loadPageForRoute(null, "sysadmin");
        }).fail(function (err) {
            // TODO : error msg
        });
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {

        // logout button
        $("#navbar-link-logout").on("click", function () {
            app.routerBase.logUserOut();
        });
    },


    // System admin routes
    routes: {
        "/sysadmin/create-store": {
            title: "SysAdmin - Create Store",
            file: "create-store",
            initFunction: function (routeData) {
                app.sysadmin.createStore.init();
            },
        },
        "/sysadmin/edit-store": {
            title: "SysAdmin - Edit Store",
            file: "edit-store",
            initFunction: function (routeData) {
                app.sysadmin.editStore.init();
            },
        },
        "/sysadmin/database": {
            title: "SysAdmin - Database",
            file: "database",
            initFunction: function (routeData) {
                app.sysadmin.database.init();
            },
        },
    }

}


// create arrays of filepaths for express router
app.sysadmin.routesList = Object.keys(app.sysadmin.routes);



// Sysadmin
app.sysadmin.createStore = {


    init: function (routeData) {
        var self = this;

        this.businessHoursArray = this.generateBusinessHours();


        // load tabcontrol
        new app.controls.TabControl("#page-sysadmin-tabcontrol", function (tab) { });


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data)
        });


        // generate a random password
        $("input[name='password']").val(this.generatePassword());


        // add business hour select elements
        $("#business-hours-container select").each(function (index, el) {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < self.businessHoursArray.length; i++) {
                frag.appendChild($("<option>" + self.businessHoursArray[i] + "</option>")[0]);
            }

            $(el).append(frag);
            $(el)[0].size = "10";
        });

        $("#fileupload").on("change", function (e) {
            if (e.target && e.target.files && e.target.files.length > 0) {
                console.log(e.target.files[0])
            }
        });

        $("#form-create-store").on("submit", function (e) {
            var data = validate.collectFormValues($("#form-create-store")[0], { trim: true });
console.log(data)
//            if (!app.util.validateInputs(data, app.validationRules.createStore))
//                return false;

            return false;
        })


//        // file upload button
//        $("#fileupload").fileupload({
//            maxNumberOfFiles: 1,
//            acceptFileTypes: /^image\/(jpe?g|png)$/i,
//            paramName: "logo",
//            maxFileSize: 250000,
//            formData: {  },
//            url: "/api/v1/upload-logo",
//
//            add: function (e, data) {
//                // validate selected file
//
//                console.log(data)
//
////                var $this = $(this);
////                var validation = data.process(function () {
////                    if (data.files.length < 1) return false;
////                    if (data.files[0].size > 250000) return false;
////
////                    return $this.fileupload('process', data.files);
////                });
////
////                validation.done(function() {
////                    data.submit(); // ok
////                });
////
////                validation.fail(function(data) {
////                    app.util.showToast("Error - " + data.files[0].error);
////                    return;
////                });
//            },
//
//            beforeSend: function() {
//                $("#store-logo-loading").show();
//            },
//
//            done: function (e, data) {
//                self.afterImageUploaded(data);
//            },
//
//            fail: function(e, data) {
//                $("#store-logo-loading").hide();
//                app.util.showToast("Unknown server error");
//            }
//        });

    },


//    // After an image is uploaded
//    afterImageUploaded: function (data) {
//
//        // load image into background of div
//        var fr = new FileReader();
//        fr.onload = function () {
//            $("#store-logo").css({
//                "background-image": "url(" + fr.result + ")"
//            });
//
//            $("#store-logo-loading").hide();
//        }
//        fr.readAsDataURL(data.files[0]);
//    },


    // Generates a random string for the users first password
    generatePassword: function () {
        return Math.random().toString(36).substr(2, 8);
    },


    // Generates the business hours for the select elements
    generateBusinessHours: function () {
        var currentHour = "";
        var currentMin = "";
        var output = [];

        for (var i = 0; i < 24; i++) {
            currentHour = i < 10 ? "0" + i : i.toString();

            for (var j = 0; j < 4; j++) {
                switch (j) {
                    case 0: currentMin = ":00"; break;
                    case 1: currentMin = ":15"; break;
                    case 2: currentMin = ":30"; break;
                    case 3: currentMin = ":45"; break;
                }

                output.push(currentHour + currentMin);
            }
        }

        return output;
    },

}

// Sysadmin database
app.sysadmin.database = {


    init: function (routeData) {
        var self = this;



    },




}

// Sysadmin database
app.sysadmin.editStore = {


    init: function (routeData) {
        var self = this;



    },




}

app.navbar = {


    // Init
    init: function (routeData) {
        var self = this;

        // Item clicked.  // TODO : security
        $(".navbar a").on("click", function (e) {
            var isCms = window.location.pathname.indexOf("/store-admin") === 0;

            if (this.innerText.toLowerCase() == "blog") {
                app.util.showToast("Not working yet");
                return false;
            }

            if (this.innerText.toLowerCase() == "account") {
                if (!isCms) {
                    app.routerBase.loadPageForRoute("/account/" + app.util.getPersonIdFromStorage(), "site");
                }
                return false;
            }

            if (this.innerText.toLowerCase() == "logout") {
                app.routerBase.logUserOut();
                return false;
            }


            var route = this.href.replace(window.location.origin, "");
            var section = "site";
            if (window.location.pathname.indexOf("/store-admin") === 0) {
                section = "cms";
                route = "/store-admin/" + app.util.getStoreIdFromStorage() + e.target.pathname;
            }

            var routeData = app.routerBase.loadPageForRoute(route, section);

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
                window.location.href = "/admin-login";
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


    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;
        this.lastSection = section;


        // reset window events // TODO : test is working
        $(window).off();
        $(document).off();


        // for back button after pushstate
        window.onpopstate = function () {
            self.loadPageForRoute(window.location.pathname, self.lastSection, true);
        };


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
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/logout", auth: true
        }, function (err) {
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


// Store content
app.storeContent = {

    init: function (routeData) {
        var self = this;

        this.descriptionEl = $("#store-info-description");
        this.storeMenuNavEl = $("#store-menu-nav");

        // store id from url
        var storeId = routeData.route.split("/");
        storeId = storeId[storeId.length - 1];


        // Get store data
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/store", data: { id_store: storeId }
        }, function (err, result) {
            if (err) return;

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
        if (data.products) {
            for (var i = 0; i < data.products.length; i++) {

//                // product category heading
//                frag.append(
//                    $("<div class='store-menu-list-item heading'>" +
//                        "<h4 class='store-menu-list-item-group-heading'>" + data.products[i].name + "</h4>" +
//                        "<hr class='hr-1' />" +
//                    "</div>")[0]);

                // product items
//                for (var j = 0; j < data.products[i].items.length; j++) {
//                    item = data.products[i].items[j];

                item = data.products[i];

                itemProperties = "";
                if (item.gluten_free) itemProperties += "<label class='label-gluten-free'>GLUTEN FREE</label>";
                if (item.vegetarian) itemProperties += "<label class='label-vegetarian'>VEGETARIAN</label>";
                if (!item.delivery_available) itemProperties += "<label class='label-takeaway'>DELIVERY NOT AVAILABLE</label>";

                if (!itemProperties) itemProperties = "<br />";

                frag.append(
                    $("<div class='store-menu-list-item clearfix'>" +
                        "<div>" +
                            "<h4>" + item.name + "</h4>" +
                            "<p>" + item.description + "</p>" +
                            itemProperties +
                        "</div>" +
                        "<label>Add to order</label>" +
                    "</div>")[0]);
//                }
            }

            $("#store-menu-list").append(frag);


//            // Category nav
//            frag = document.createDocumentFragment();
//            for (var i = 0; i < data.products.length; i++) {
//                frag.append($("<li class='store-menu-nav-list-item'>" + data.products[i].name + "</li>")[0])
//            }
//            $("#store-menu-nav-list").append(frag);
//
//            $(".store-menu-nav-list-item").on("click", function (e) {
//                var el = $(".store-menu-list-item-group-heading:contains('" + e.target.innerText + "')");
//
//                $("html").animate({ scrollTop: el[0].offsetTop }, 500);
//            });
        }



        // Checkout




        // Setup dialogs
        app.dialogs.description.init(data.name, data.description);
        app.dialogs.businessHours.init(data.hours);
        //app.dialogs.reviews.init(data);

        $("#store-info-button-hours").show();
        $("#store-info-button-reviews").show();

        this.resizeDescription();
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
            $("#toasts").children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });
        }

        // append toasts message and show toasts
        $("#toasts").append(toast[0]);
        $("#toasts").show();

        $(toast).animate({ opacity: 1, bottom: 0 }, 100);

        // hide toast after a little bit
        var currentToast = setTimeout(function () {
            $("#toasts").children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });

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
    checkToken: function (callback) {
        var self = this;
        var jwt = this.getJwtFromStorage();

        if (jwt && jwt.length > 30) {

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
                    localStorage.setItem("sid", result.data.id_store);
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


    // Generic ajax request
    // options are { method, url, data, auth, datatype, cache }, returns (err, data)
    ajaxRequest: function (options, callback) {
        var self = this;

        // setup options
        var ajaxOptions = {
            method: options.method,
            url: options.url,
            data: options.data,
            cache: options.cache || false,
            beforeSend: function(request) {
                if (options.auth) {
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

app.vr.storeApplication = {
    name: { presence: true, length: { maximum: 128 }},
    email: app.vr._email,
    message: { length: { maximum: 256 }}
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

