"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// CMS pages
app.cms = {

    htmlFiles: {}, // cached html

    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,


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

        app.routerBase.loadPageForRoute(null, "cms");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.cms.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;

        if (this.regexUrlStoreAdmin.exec(route)) {
            var temp = route.split("/");
            route = "/store-admin/:id/" + temp[temp.length - 1];
            match = true;
        }

        return { route: route, match: match };
    },


    // CMS routes
    routes: {
        "/store-admin/:id/business": {
            title: "Business",
            file: "business",
            initFunction: function (routeData) {
                app.cms.business.init(routeData);
            },
        },
        "/store-admin/:id/dashboard": {
            title: "Dashboard",
            file: "dashboard",
            initFunction: function (routeData) {
                app.cms.dashboard.init(routeData);
            },
        },
        "/store-admin/:id/delivery-suburbs": {
            title: "Delivery Suburbs",
            file: "delivery-suburbs",
            initFunction: function (routeData) {
                app.cms.deliverySuburbs.init(routeData);
            },
        },
        "/store-admin/:id/menu": {
            title: "Menu",
            file: "menu",
            initFunction: function (routeData) {
                app.cms.menu.init(routeData);
            },
        },
        "/store-admin/:id/orders": {
            title: "Orders",
            file: "orders",
            initFunction: function (routeData) {
                app.cms.orders.init(routeData);
            },
        },
        "/store-admin/:id/details": {
            title: "Details",
            file: "details",
            initFunction: function (routeData) {
                app.cms.details.init(routeData);
            },
        },
        "/store-admin/:id/transactions": {
            title: "Transactions",
            file: "transactions",
            initFunction: function (routeData) {
                app.cms.transactions.init(routeData);
            },
        },
    },

}



// create arrays of filepaths for express router
app.cms.routesList = Object.keys(app.cms.routes);



// Business page
app.cms.business = {

    init: function () {
        var self = this;
    },

}

// Dashboard page
app.cms.dashboard = {

    init: function () {
        var self = this;
    },

}

// Delivery suburbs page
app.cms.deliverySuburbs = {

    init: function () {
        var self = this;
    },

}

// Details page
app.cms.details = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData, true);

        this.$storeInfo = $("#store-info");
        this.$storeInfoEdit = $("#store-info-edit");

        var lastScrollPosition = 0; // for scrolling back down after return to editing


        // Get the store details data
        app.storeContent.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // address suburb typeahead
        this.typeahead = new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                console.log(data);
            }
        });


        // change typeahead label capitalization
        $("#typeahead-suburb > label").text("Suburb");


        // Show Edit mode
        $(".page-cms-details-return").on("click", function () {
            $(this).hide();
            $(".page-cms-details-preview").show();
            $("#preview-mode-border").hide();

            self.$storeInfo.hide();
            self.$storeInfoEdit.show();

            $("html, body").animate({ "scrollTop": lastScrollPosition }, 200);
        });


        // Show Preview
        $(".page-cms-details-preview").on("click", function () {
            lastScrollPosition = $("html").scrollTop();

            $(this).hide();
            $(".page-cms-details-return").show();
            $("#preview-mode-border").show();

            self.$storeInfoEdit.hide();
            self.$storeInfo.show();
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                $(".store-info-image-empty").hide();
                $(".store-info-image-loading").show();

                // send image to server
                app.util.uploadImage(e.target.files, function (err, imgPath) {
                    if (err) {
                        app.util.showToast(err);
                        return;
                    }

                    // add base64 image to image element
                    var file = e.target.files[0];
                    var reader  = new FileReader();
                    reader.addEventListener("load", function () {
                        app.storeContent.$logo.each(function (index, el) {
                            el.src = reader.result;
                        });
                        $(".store-info-image-empty").hide();
                        $(".store-info-image-loading").hide();
                    }, false);

                    reader.addEventListener("error", function () {
                        $(".store-info-image-empty").hide();
                        $(".store-info-image-loading").hide();
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });
            }
        });


        // Save store details form
        this.$storeInfoEdit.on("submit", function () {
            var data = validate.collectFormValues($("#store-info-edit")[0], { trim: true })


            // check hours
            var hoursErr = app.validationRules.validateHours(data);
            if (hoursErr) {
                app.util.showToast(hoursErr, 5000);
                return false;
            }


            // remove logo
            delete data.logo;


            // get postcode/suburb
            var postcodeSuburb = self.typeahead.getValue();
            data.suburb = postcodeSuburb.suburb;
            data.postcode = postcodeSuburb.postcode;

            if (!app.util.validateInputs(data, app.validationRules.updateStoreDetails))
                return false;

            // send data
            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-details", data: data, auth: true
            }, function (err, result) {
                if (err) return false;

                app.util.showToast("SAVED", null, "success");
            });

            return false;
        });
    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {
            var dayStringsLc = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
            console.log(storeData)

            app.storeContent.addStoreDetailsDataToPage(storeData);

            var address = storeData.address[0];

            this.$storeInfoEdit[0][1].value = storeData.description;
            this.$storeInfoEdit[0][2].value = address.street_address;
            this.typeahead.setValue(address.postcode, address.suburb);
            this.$storeInfoEdit[0][4].value = storeData.phone_number;
            this.$storeInfoEdit[0][5].value = storeData.email;

            // hours
            Object.keys(storeData.hours).forEach(function (key, index) {
                if (key.indexOf("hours_") === 0) {
                    $("[name='" + key + "']").val(
                        (storeData.hours[key] === "NULL") ? "" : storeData.hours[key]);
                }
            });
        }
    },


}

// Menu page
app.cms.menu = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData, true);


        // Get the store menu data
        app.storeContent.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // Show Edit mode
        $(".cms-menu-return").on("click", function () {
            $("#store-info-inner").hide();
            $("#store-info-edit").show();

            $("#preview-mode-border").hide();
            $(".cms-menu-preview").show();
            $(".cms-menu-return").hide();
        });


        // Show Preview
        $(".cms-menu-preview").on("click", function () {
            $("#store-info-edit").hide();
            $("#store-info-inner").show();

            $("#preview-mode-border").show();
            $(".cms-menu-preview").hide();
            $(".cms-menu-return").show();
        });

    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {
            app.storeContent.addMenuDataToPage(storeData);
        }
    },

}
// Cms navbar
app.cms.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);


        // set active page
        $(".navbar-links a").removeClass("active");
        $(".navbar-link-" + (routeData.file)).addClass("active");


        // add store id's to links
        var storeId = app.util.getStoreIdFromStorage();
        $("#navbar-cms a").each(function (index, el) {
            var href = $(this).attr("href");
            $(this).attr("href", href.replace(":storeId", storeId));
        });


        // link clicked
        navbar.linkClicked = function (e, route) {
            app.routerBase.loadPageForRoute(route, "cms");
            return false;
        }

    },

}

// Orders page
app.cms.orders = {

    init: function () {
        var self = this;
    },

}

// Transactions page
app.cms.transactions = {

    init: function () {
        var self = this;
    },

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
                itemProperties = "";

                if (item.gluten_free) itemProperties += "<label class='label-gluten-free'>GLUTEN FREE</label>";
                if (item.vegetarian) itemProperties += "<label class='label-vegetarian'>VEGETARIAN</label>";
                if (!item.delivery_available) itemProperties += "<label class='label-takeaway'>DELIVERY NOT AVAILABLE</label>";

                if (!itemProperties) itemProperties = "<br />";

                frag.append(
                    $("<div class='store-menu-list-item clearfix' data-id-product='" + item.id_product + "'>" +
                        "<div>" +
                            "<h4>" + item.name + "</h4>" +
                            "<p>" + item.description + "</p>" +
                            itemProperties +
                        "</div>" +
                        "<label>Add to order</label>" +
                    "</div>")[0]);
            }


            // create product heading items
            if (data.product_headings) {
                for (var i = 0; i < data.product_headings.length; i++) {
                    var heading = data.product_headings[i];

                    var el = $(frag).find(".store-menu-list-item[data-id-product='" +
                                 heading.above_product_id + "']");

                    if (el) {
                        $("<div class='store-menu-list-item heading' data-id-heading='" + heading.id_product_heading + "'>" +
                            "<h4 class='store-menu-list-item-group-heading'>" + heading.title + "</h4>" +
                            "<hr class='hr-1' />" +
                        "</div>").insertBefore(el);
                    }
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
