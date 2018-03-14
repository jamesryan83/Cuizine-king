"use strict";

var app = app || {};
app.controls = app.controls || {};
app.dialogs = app.dialogs || {};



// CMS pages
app.cms = {

    htmlFiles: {}, // cached html

    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,


    init: function (html) {

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);

        this.htmlFiles = html;

        app.util.setupTemplateFormatters();

        // Dialogs
        app.dialogs.init();

        // setup router
        app.routerBase.init();

        app.routerBase.loadPageForRoute(null, "cms");
    },


    // Called whenever the page is changed
    onPageChanged: function (routeData) {
        app.cms.navbar.init(routeData);
    },


    // Remove user specific parts of a url
    normalizeRoute: function (route) {
        var match = false;
        var newRoute = route;

        if (this.regexUrlStoreAdmin.exec(route)) {
            newRoute = newRoute.split("/");
            newRoute = "/store-admin/:id/" + newRoute[newRoute.length - 1];
            match = true;
        }

        return { route: newRoute, match: match };
    },


    // CMS routes
    routes: {
        "/store-admin/:id/business": {
            file: "business",
            initFunction: function (routeData) {
                document.title = app.Strings.business;
                app.cms.business.init(routeData);
            },
        },
        "/store-admin/:id/dashboard": {
            file: "dashboard",
            initFunction: function (routeData) {
                document.title = app.Strings.dashboard;
                app.cms.dashboard.init(routeData);
            },
        },
        "/store-admin/:id/delivery-suburbs": {
            file: "delivery-suburbs",
            initFunction: function (routeData) {
                document.title = app.Strings.deliverySuburbs;
                app.cms.deliverySuburbs.init(routeData);
            },
        },
        "/store-admin/:id/menu": {
            file: "menu",
            initFunction: function (routeData) {
                document.title = app.Strings.menu;
                app.cms.menu.init(routeData);
            },
        },
        "/store-admin/:id/orders": {
            file: "orders",
            initFunction: function (routeData) {
                document.title = app.Strings.orders;
                app.cms.orders.init(routeData);
            },
        },
        "/store-admin/:id/details": {
            file: "details",
            initFunction: function (routeData) {
                document.title = app.Strings.details;
                app.cms.details.init(routeData);
            },
        },
        "/store-admin/:id/transactions": {
            file: "transactions",
            initFunction: function (routeData) {
                document.title = app.Strings.transactions;
                app.cms.transactions.init(routeData);
            },
        },
    },

}


app.cms.routesList = Object.keys(app.cms.routes);




// Business page
app.cms.business = {

    init: function () {

    },

}

// Dashboard page
app.cms.dashboard = {

    init: function () {

    },

}

// Delivery suburbs page
app.cms.deliverySuburbs = {

    init: function () {

    },

}

// Details page
app.cms.details = {

    init: function () {
        var self = this;

        app.storeContent.init();

        this.$storeInfo = $("#store-info");
        this.$detailsForm = $("#store-info-edit");
        this.$storeInfoEdit = $("#store-info-edit");
        this.$previewBorder = $("#preview-mode-border");
        this.$returnButton = $(".page-cms-details-return");
        this.$previewButton = $(".page-cms-details-preview");


        // for scrolling back down after return to editing
        var lastScrollPosition = 0;


        // address suburb typeahead
        this.typeahead = new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                console.log(data);
            }
        });


        // Get the store details data
        app.data.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // change typeahead label capitalization
        $("#typeahead-suburb > label").text("Suburb");


        // Show Edit mode
        this.$returnButton.on("click", function () {
            $(this).hide();
            self.$previewButton.show();
            self.$previewBorder.hide();
            self.$returnButton.hide();

            self.$storeInfo.hide();
            self.$storeInfoEdit.show();

            $("html, body").animate({ "scrollTop": lastScrollPosition }, 200);
        });


        // Show Preview
        this.$previewButton.on("click", function () {
            lastScrollPosition = $("html").scrollTop();

            $(this).hide();
            self.$previewButton.hide();
            self.$returnButton.show();
            self.$previewBorder.show();

            self.$storeInfoEdit.hide();
            self.$storeInfo.show();
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                app.storeContent.$logoEmpty.hide();
                app.storeContent.$logoLoading.show();

                // send image to server
                app.util.uploadImage(e.target.files, function (err) {
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

                        app.storeContent.$logoEmpty.hide();
                        app.storeContent.$logoLoading.hide();
                    }, false);

                    reader.addEventListener("error", function () {
                        app.storeContent.$logoEmpty.hide();
                        app.storeContent.$logoLoading.hide();
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });
            }
        });


        // Save store details form
        this.$storeInfoEdit.on("submit", function () {
            var data = validate.collectFormValues(this.$detailsForm[0], { trim: true })


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

                console.log(result);
                app.util.showToast(app.Strings.saved, null, "success");
            });

            return false;
        });
    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {

            app.storeContent.addStoreDetailsDataToPage(null, storeData, "cms");

            var address = storeData.address[0];

            this.$storeInfoEdit[0][1].value = storeData.description;
            this.$storeInfoEdit[0][2].value = address.street_address;
            this.typeahead.setValue(address.postcode, address.suburb);
            this.$storeInfoEdit[0][4].value = storeData.phone_number;
            this.$storeInfoEdit[0][5].value = storeData.email;

            // hours
            Object.keys(storeData.hours).forEach(function (key) {
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

    init: function () {
        var self = this;

        app.storeContent.init();


        this.$categoryScrollerContainer = $(".category-scroller-container");
        this.$storeMenuList = $("#store-menu-list");
        this.$editMenuItems = $("#edit-menu-items");
        this.$previewBorder = $("#preview-mode-border");
        this.$returnButton = $(".cms-menu-return");
        this.$previewButton = $(".cms-menu-preview");
        this.$addCategoryButton = $("#cms-menu-add-category");
        this.$addMenuItemButton = $("#cms-menu-add-menu-item");
        this.$saveButton = $("#page-cms-menu-save");
        this.$editMenuItemsList = $("#edit-menu-items-list");

        this.categoryScroller = null;


        // Get the store menu data
        app.data.getStoreData(function (storeData) {
            if (!storeData) {
                console.log("no data")
                return;
            }

            self.setupPage(storeData);
        });


        // Show Edit mode
        this.$returnButton.on("click", function () {
            self.$categoryScrollerContainer.hide();
            self.$storeMenuList.hide();
            self.$editMenuItems.show();

            self.$previewBorder.hide();
            self.$previewButton.show();
            self.$returnButton.hide();
            self.$addCategoryButton.show();
            self.$addMenuItemButton.show();
            self.$saveButton.show();
        });


        // Show Preview
        this.$previewButton.on("click", function () {
            self.$categoryScrollerContainer.show();
            self.$storeMenuList.show();
            self.$editMenuItems.hide();

            self.$previewBorder.show();
            self.$previewButton.hide();
            self.$returnButton.show();
            self.$addCategoryButton.hide();
            self.$addMenuItemButton.hide();
            self.$saveButton.hide();

            self.categoryScroller.updateHeadingPositions();
        });


        // Add category
        this.$addCategoryButton.on("click", function () {
            var catButton = app.util.loadTemplate(
                "#template-edit-menu-item-heading");


            self.$editMenuItemsList.append(catButton)
        });



        // Add menu item
        this.$addMenuItemButton.on("click", function () {

        });



    },


    // Add data to page
    setupPage: function (storeData) {
        var self = this;

        if (storeData) {
            app.storeContent.addMenuDataToPage(storeData);

            // menu drag/drop
            var drake = dragula([$("#edit-menu-items-list")[0]]);

            drake.on("drop", function (el, target, source, sibling) {
//                app.data.getMenuPositions($(".store-menu-list-item"));
            });


            console.log(storeData)


            // add products to list


            // add headings to list
            var frag = document.createDocumentFragment();
            for (var i = 0; i < storeData.product_headings.length; i++) {
                var heading = storeData.product_headings[i];

                heading = app.util.loadTemplate(
                    "#template-edit-menu-item-heading", heading);

                frag.append(heading[0]);
            }

            this.$editMenuItemsList.append(frag);

            // Category scroller
            self.categoryScroller =
                new app.controls.CategoryScroller(
                storeData.product_headings, 100, 100);
        }
    },

}
// Cms navbar
app.cms.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);
        var noClick = false;

        // set active page
        $(".navbar-links a").removeClass("active");
        $(".navbar-link-" + (routeData.file)).addClass("active");


        // add store id's to links
        var storeId = app.data.getStoreIdFromStorage();
        $("#navbar-cms a").each(function () {
            var href = $(this).attr("href");
            $(this).attr("href", href.replace(":storeId", storeId));
        });


        // link clicked
        navbar.linkClicked = function (e, route) {

            // prevent clicking too much
            if (noClick) return;
            noClick = true;
            setTimeout(function () {
                app.routerBase.loadPageForRoute(route, "cms");
                noClick = false;
            }, 250);

            return false;
        }


    },

}

// Orders page
app.cms.orders = {

    init: function () {

    },

}

// Transactions page
app.cms.transactions = {

    init: function () {

    },

}



app.data = {


    storeDataRequestNotAllowed: false,
    storeData: {},  // store data cache



    // ---------------------- Store Data ----------------------


    // Gets the store data and caches it for a little while
    getStoreData: function (id_store, callback) {
        if (typeof id_store === "function") {
            callback = id_store;
            id_store = null;
        }

        var self = this;

        // check if already running
        if (this.storeDataRequestNotAllowed) {
            return callback(this.storeData);
        }

        var id_store = id_store || this.getStoreIdFromStorage();

        if (!app.util.validateInputs({ id_store: id_store }, app.validationRules.getStore))
            return false;


        // set timeout
        this.storeDataRequestNotAllowed = true;
        setTimeout(function () {
            self.storeDataRequestNotAllowed = false;
        }, 2000);


        // get data from server
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/store?id_store=" + id_store, cache: true
        }, function (err, result) {
            if (err) return;

            result.data.hours = result.data.hours[0];
            self.storeData = result.data; // cache storeData

            return callback(self.storeData);
        });
    },


    // TODO : i18n
    // Returns if dinein/delivery is open and text for next time open or closed
    // the parameters are for testing
    isStoreOpen: function (timeNow, dayNow, addDays) {
        if (!this.storeData || Object.keys(this.storeData).length === 0) return null;

        var result = { isDineinOpen: false, isDeliveryOpen: false };

        var d = new Date();
        var currentTime = timeNow || d.getHours() + ":" + d.getMinutes();
        var mCurrentTime = moment(currentTime, "HH:mm").add(addDays || 0, "days");


        // get business times
        var today = dayNow || app.util.getTodayName();
        var dineinOpenTime = this.storeData.hours["hours_" + today + "_dinein_open"];
        var dineinCloseTime = this.storeData.hours["hours_" + today + "_dinein_close"];
        var deliveryOpenTime = this.storeData.hours["hours_" + today + "_delivery_open"];
        var deliveryCloseTime = this.storeData.hours["hours_" + today + "_delivery_close"];


        // is dinein open
        if (dineinOpenTime !== "NULL" && dineinCloseTime !== "NULL") {
            var mDineInOpen = moment(dineinOpenTime, "HH:mm");
            var mDineInClose = moment(dineinCloseTime, "HH:mm");
            if (mDineInClose.isBefore(mDineInOpen)) mDineInClose.add(1, "days");

            if (dineinOpenTime === currentTime || mCurrentTime.isBetween(mDineInOpen, mDineInClose)) {
                result.isDineinOpen = true;
            }
        }


        // is delivery open
        if (deliveryOpenTime !== "NULL" && deliveryCloseTime !== "NULL") {
            var mDeliveryOpen = moment(deliveryOpenTime, "HH:mm");
            var mDeliveryClose = moment(deliveryCloseTime, "HH:mm");
            if (mDeliveryClose.isBefore(mDeliveryOpen)) mDeliveryClose.add(1, "days");

            if (deliveryOpenTime === currentTime || mCurrentTime.isBetween(mDeliveryOpen, mDeliveryClose)) {
                result.isDeliveryOpen = true;
            }
        }

        return result;
    },



    // TODO : finish
    // Returns text saying when the store opens or closes next
    getWhenStoreOpensOrClosesNext: function (timeNow, dayNow, addDays) {
        if (!this.storeData || Object.keys(this.storeData).length === 0) return null;

        var isOpen = this.isStoreOpen(timeNow, dayNow, addDays);

        if (isOpen.isDineinOpen && isOpen) {

        } else {

        }
    },



    // Returns the positions of the headings and menu items for the server
    getMenuPositions: function (items) {
        var idNext = null;
        var idPrevious = null;
        var last = items.length - 1;
        var positions = { headings: [], products: [] };


        for (var i = 0; i < items.length; i++) {
            idPrevious = i === 0 ? null : (items[i - 1].dataset.headingId || items[i - 1].dataset.productId);
            idNext = i === last ? null : (items[i + 1].dataset.headingId || items[i + 1].dataset.productId);

            // item is product
            if (items[i].dataset.productId) {
                positions.products.push({
                    productId: items[i].dataset.productId,
                    position_id_previous: idPrevious,
                    position_id_next: idNext
                });

            // item is heading
            } else if (items[i].dataset.headingId) {
                positions.headings.push({
                    headingId: items[i].dataset.headingId,
                    above_product_id: idNext
                });
            }
        }

        return positions;
    },



    // ---------------------- Checkout Data ----------------------


    // Returns checkout data or an empty checkout object
    getCheckoutData: function () {
        var data = window.sessionStorage.getItem("cod");

        try { data = JSON.parse(data); } catch (e) { }

        if (!data) data = [];

        return data;
    },


    // Sets the checkout data
    setCheckoutData: function (data) {
        window.sessionStorage.setItem("cod", JSON.stringify(data));
    },





    // ---------------------- Tokens ----------------------

    // Add token to storage
    addJwtToStorage: function (token) {
        localStorage.setItem("jwt", token);
    },


    // Returns token from storage
    getJwtFromStorage: function () {
        var item = localStorage.getItem("jwt");
        if (app.util.checkIfString(item)) {
            return item;
        }

        return null;
    },


    // Add person id to storage
    addPersonIdToStorage: function (id) {
        localStorage.setItem("pid", id);
    },


    // Returns person id from storage
    getPersonIdFromStorage: function () {
        var item = Number(localStorage.getItem("pid"));
        if (app.util.checkIfPositiveInteger(item)) {
            return item;
        }

        return null;
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        var item = Number(localStorage.getItem("sid"));
        if (app.util.checkIfPositiveInteger(item)) {
            return item;
        }

        return null;
    },


    // Replace current id and jwt with invalid ones
    invalidateTokensAndGoToLogin: function () {
        localStorage.removeItem("jwt");
        localStorage.removeItem("pid");
        localStorage.removeItem("sid");
        window.location.href = "/login";
    },

}




// Business hours dialog
app.dialogs.businessHours = {

    init: function () {
        var self = this;

        this.$hoursLeft = $("#dialog-store-hours-left");
        this.$hoursRight = $("#dialog-store-hours-right");

        $("#dialog-store-hours-close").on("click", function () {
            self.hide();
        });
    },


    // update dialog content
    update: function (hours) {
        if (!hours) return;

        var days = app.util.days();
        var today = app.util.getTodayName();


        // add left hours
        var frag = document.createDocumentFragment();
        for (var i = 0; i < days.length; i++) {
            frag.appendChild($(this.getHoursRow(hours, days[i], true, today === days[i]))[0]);
        }
        this.$hoursLeft.append(frag);


        // add right hours
        frag = document.createDocumentFragment();
        for (var i = 0; i < days.length; i++) {
            frag.appendChild($(this.getHoursRow(hours, days[i], false, today === days[i]))[0]);
        }
        this.$hoursRight.append(frag);
    },


    // Returns a html row of hours for a single day
    getHoursRow: function (hours, day, isDineIn, isToday) {
        // TODO : i18n

        // create left and right property names
        var el = "hours_" + day.toLowerCase() + "_" + (isDineIn ? "dinein" : "delivery");
        var openEl = el + "_open";
        var closeEl = el + "_close";


        // create text
        var text = hours[openEl];
        if (text.toLowerCase() === "null") {
            text = "closed";
        } else {
            text = hours[openEl] + " to " + hours[closeEl];
        }

        // highlight today
        var todayClass = "";
        if (isToday) todayClass = "today";

        return "<li class='" + todayClass + "'><span>" + day.toUpperCase() + "</span> " + text + "</li>";
    },


    // show dialog
    show: function () {
        app.dialogs.show("#dialog-store-hours");
    },


    // hide dialog
    hide: function () {
        app.dialogs.hide();
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
        app.dialogs.show("#dialog-store-description");
    },


    hide: function () {
        app.dialogs.hide();
    },

}
// Dialog container
app.dialogs.init = function () {

    // initialize available dialogs
    Object.keys(this).forEach(function (el) {
        if (app.dialogs[el].init) {
            app.dialogs[el].init();
        }
    });


    this.$dialogContainer = $("#dialog-container");


    this.$dialogContainer.on("click", function () {

    });
}


app.dialogs.show = function (dialogEl) {
    this.$dialogContainer.show();
    $(dialogEl).show();
}


app.dialogs.hide = function () {
    this.$dialogContainer.children().hide();
    this.$dialogContainer.hide();
}

app.dialogs.addDialog = function (html) {
    this.$dialogContainer.append($(html));
}


// Reviews dialog
app.dialogs.reviews = {


    init: function () {
        var self = this;

        $("#dialog-store-reviews-add-review").on("click", function () {
            app.util.showToast("not working yet")
        });

        $("#dialog-store-reviews-close").on("click", function () {
            self.hide();
        });
    },


    update: function (data) {
        return;
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
        app.dialogs.show("#dialog-store-reviews");
    },


    hide: function () {
        app.dialogs.hide();
    },

}
// Base client side router
app.routerBase = {


    firstLoad: true,
    lastLoadedSection: "",
    isLoading: false,


    // Init
    init: function () {

        // For Cordova
        document.addEventListener("deviceready", function () {
            app.cordova.init();
        }, false);
    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;

        if (this.isLoading) return;
        if (window.location.pathname === route && !isAfterPopState) return; // same page

        this.isLoading = true;
        this.lastLoadedSection = section;


        // reset window events // TODO : test is working
        $(window).off();
        $(document).off();


        // for back button after pushstate
        window.onpopstate = function () {
            console.log("on popstate " + window.location.pathname);
            self.loadPageForRoute(window.location.pathname, self.lastLoadedSection, true);
        };


        // get data for route
        var newRoute = route || window.location.pathname;
        var routeData = { route: newRoute };
        if (app.util.isCordova()) {
            // remove extra cordova stuff from route
            newRoute = newRoute.substring(newRoute.lastIndexOf("/"), newRoute.length - 5);
            if (newRoute == "/index-cordova") newRoute = "/";
        }

        // normalize route and add current section
        routeData.normalizedRoute = app[section].normalizeRoute(newRoute).route;
        routeData.section = section;


        // Add html and other route data
        if (app[section].routesList.indexOf(routeData.normalizedRoute) !== -1) {
            routeData.html = app[section].htmlFiles[routeData.normalizedRoute];
            $.extend(routeData, app[section].routes[routeData.normalizedRoute]);

        // unknown route
        } else {
            debugger;
            app.data.invalidateTokensAndGoToLogin();
            return;
        }


        // load html into page
        $("#page-container").empty();
        $("#dialog-container").empty();
        $("#page-container").append(routeData.html);

        $("html, body").animate({ "scrollTop": 0 }, 200);


        // start js
        app[section].routes[routeData.normalizedRoute].initFunction(routeData);
        app[section].onPageChanged(routeData);


        // run ui stuff when page is loaded
//        setTimeout(function () {
            $("body").css("visibility", "visible");
//        }, 0);


        // push route into history, but not on back
        if (!this.firstLoad && !isAfterPopState) {
            if (routeData.route != window.location.pathname) {
                window.history.pushState(null, routeData.route, routeData.route);
            }
        }

        this.firstLoad = false;
        this.isLoading = false;

        return routeData;
    },




//    // Returns the data for the current route
//    getCurrentRouteData: function (route, section) {
//        var newRoute = route || window.location.pathname;
//        var routeData = { route: newRoute };
//
//        if (app.util.isCordova()) {
//            // remove extra cordova stuff from route
//            newRoute = newRoute.substring(newRoute.lastIndexOf("/"), newRoute.length - 5);
//            if (newRoute == "/index-cordova") newRoute = "/";
//        }
//
//        // normalize route and add current section
//        routeData.normalizedRoute = app[section].normalizeRoute(newRoute).route;
//        routeData.section = section;
//
//        // Add html and other route data
//        if (app[section].routesList.indexOf(routeData.normalizedRoute) !== -1) {
//            routeData.html = app[section].htmlFiles[routeData.normalizedRoute];
//            $.extend(routeData, app[section].routes[routeData.normalizedRoute]);
//
//        // unknown route
//        } else {
//            debugger;
//            app.data.invalidateTokensAndGoToLogin();
//            return;
//        }
//
//        return routeData;
//    },



    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/logout", auth: true
        }, function () {
            app.data.invalidateTokensAndGoToLogin();

        });
    },



    // Get if the user is logged in
    isUserLoggedIn: function () {
        var jwt = app.data.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },

}




// Store content
// This is the details and menu sections used on the store page and edit store page
app.storeContent = {


    init: function () {

        this.$storeInfo = $("#store-info");
        this.$logo = $(".store-info-image");
        this.$description = $("#store-info-description");
        this.$logoEmpty = $(".store-info-image-empty");
        this.$logoLoading = $(".store-info-image-loading");
        this.$descriptionButton = $("#store-info-button-description");
        this.$descriptionContainer = $("#store-info-description-container");
        this.$hoursButton = $("#store-info-button-hours");
        this.$reviewsButton = $("#store-info-button-reviews");
        this.$menuList = $("#store-menu-list");


        this.$logoEmpty.hide();
        this.$logoLoading.show();


        // Open dialog buttons
        this.$descriptionButton.on("click", function () {
            app.dialogs.description.show();
        });

        this.$hoursButton.on("click", function () {
            app.dialogs.businessHours.show();
        });

        this.$reviewsButton.on("click", function () {
            app.dialogs.reviews.show();
        });

    },


    // Show hide more button when description text changes height
    resizeDescription: function () {
        if (this.$description[0].scrollHeight > this.$description.innerHeight()) {
            this.$descriptionButton.show();
        } else {
            this.$descriptionButton.hide();
        }
    },


    // Add store details data
    addStoreDetailsDataToPage: function (id_store, data, section) {
        var self = this;

        var id_store = id_store || app.data.getStoreIdFromStorage();
        if (!id_store) return;


        // logo
        var logo = new Image();

        // TODO : res/storelogos is in config too, do something about that
        logo.src = "/res/storelogos/store" + id_store + ".jpg?" + Date.now();
        logo.onload = function () {
            self.$logo.attr("src", logo.src);

            self.$logoEmpty.hide();
            self.$logoLoading.hide();
        }
        logo.onerror = function () {
            self.$logoLoading.hide();
            self.$logoEmpty.show();
        }


        // Format address to a single string
        var address = data.address[0];
        address = address.street_address + " " +
            address.suburb + " " + address.postcode;


        // add store details
        $("#store-header-name").text(data.name);
        this.$description.text(data.description);
        $("#store-info-address").text(address);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-review-count").text("( " + data.review_count + " )");

        // TODO : make the 'more' button for the description only show when required

        // hours
//        var isOpen = app.data.isStoreOpen();
//console.log(isOpen)
//        if (isOpen.isDeliveryOpen || isOpen.isDineinOpen) {
//
//        } else {
//
//        }



        $("#store-info-hours-is-open").text();
        $("#store-info-hours-opens-at").text();


        // rating control
        app.controls.RatingControls.setValue(
            "#store-info-rating-control", Math.round(data.rating));


        // Setup dialogs
        app.dialogs.addDialog(app[section].htmlFiles.dialog_businessHours);
        app.dialogs.businessHours.init();
        app.dialogs.businessHours.update(data.hours);

        app.dialogs.addDialog(app[section].htmlFiles.dialog_description);
        app.dialogs.description.init();
        app.dialogs.description.update(data.name, data.description);

        app.dialogs.addDialog(app[section].htmlFiles.dialog_reviews);
        app.dialogs.reviews.init();
        app.dialogs.reviews.update(data);


        // Events
        $(window).on("resize", function () {
            self.resizeDescription();
        });

    },



    // Add menu data
    addMenuDataToPage: function (data) {
        var self = this;
        var i = 0;
        var j = 0;
        var $item = null;

        // products
        var item = null;
        var frag = document.createDocumentFragment();

        if (data.products) {

//            data.products[0].name = "testest testest testest testestttestest testest testest testestt";
//            data.product_headings[0].title = "testest testest testest testestt";
//            data.products[0].options[0].name = "testest testest testest testestt";


            // create product items
            for (i = 0; i < data.products.length; i++) {
                item = data.products[i];


                // find lowest priced option and add the price to the heading
                var lowestOptionPrice = item.options[0].price;
                for (j = 0; j < item.options.length; j++) {
                    if (item.options[j].price < lowestOptionPrice) {
                        lowestOptionPrice = item.options[j].price;
                    }
                }
                item.lowestOptionPrice = lowestOptionPrice;


                // item template
                if (item.gluten_free) item.class1 = "label-gluten-free";
                if (item.vegetarian) item.class2 = "label-vegetarian";
                if (!item.delivery_available) item.class3 = "label-takeaway";


                $item = app.util.loadTemplate(
                    "#template-store-menu-item", item,
                    item.id_product, "data-product-id");


                // Panels
                var $optionsPanel = $item.find(".store-menu-list-item-options > .store-menu-list-item-content").last();
                var $option = null;
                var size = item.options.length;


                // product options
                for (j = 0; j < item.options.length; j++) {
                    $option = app.util.loadTemplate(
                        "#template-store-menu-option", item.options[j],
                        item.options[j].id_product_option, "data-product-option-id");

                    // equal width if not mobile
                    if (screen.width > 1000) {
                        $option.css({ width: (100 / size) + "%" });
                    }

                    $optionsPanel.append($option[0]);
                }

                frag.append($item[0]);
            }


            // create product heading items
            for (i = 0; i < data.product_headings.length; i++) {
                var heading = data.product_headings[i];

                // find element to put heading above
                var el = $(frag).find(".store-menu-list-item[data-product-id='" +
                             heading.above_product_id + "']");

                if (el) {
                    $item = app.util.loadTemplate(
                        "#template-store-menu-heading", heading,
                        heading.id_product_heading, "data-heading-id");

                    // add heading before element
                    $item.insertBefore(el);
                }
            }
            self.$menuList.append(frag);


            // click events
            $(".store-menu-list-item-details").on("click", function () {
                $(".store-menu-list-item").removeClass("options-active");
                $(this).parent().addClass("options-active");
            });

            $(".store-menu-list-item-options-cancel").on("click", function () {
                $(this).parent().parent().removeClass("options-active");
            });

        } else {
            self.$menuList.append(app.Strings.noProducts);
        }
    },






    // Returns a product by its id from the cached store data
    getProduct: function (id_product) {
        if (!id_product)
            return null;

        for (var i = 0; i < this.storeData.products.length; i++) {
            if (this.storeData.products[i].id_product == id_product) {
                return this.storeData.products[i];
            }
        }

        return null;
    },


    // Returns a product option by its id from the cached store data
    getProductOption: function (id_product_option) {
        if (!id_product_option)
            return null;

        var options = null;

        for (var i = 0; i < this.storeData.products.length; i++) {
            options = this.storeData.products[i].options;

            if (!options) continue;

            for (var j = 0; j < options.length; j++) {
                if (options[j].id_product_option == id_product_option) {
                    return options[j];
                }
            }
        }

        return null;
    },


}


if (typeof app === "undefined") {
    var app = {};
    app.Strings = app.Strings = {};
}


app.util = {




    // ---------------------- Validation ----------------------


    checkIfObject: function (value) {
        if (!value) return false;

        return (value && typeof value === 'object' && value.constructor === Object);
    },


    checkIfString: function (value) {
        return (typeof value === "string" || value instanceof String);
    },


    checkIfDate: function (value) {
        if (!value) return false;

        return (value instanceof Date && isFinite(value));
    },


    checkIfPositiveInteger: function (value, includeZero) {
        var intValue = parseInt(value);
        if (isNaN(intValue)) return false;

        intValue = Number(value);
        if (!Number.isInteger(intValue)) return false;

        return includeZero ? intValue >= 0 : intValue > 0;
    },


    // Validates an inputs object and shows toast if there's an error
    validateInputs: function (inputs, validationRule) {
        if (!inputs || !this.checkIfObject(inputs) || Object.keys(inputs).length === 0) {
            console.log("validation inputs missing");
            return false;
        }

        if (!validationRule) {
            console.log("validate rule undefined");
            return false;
        }

        var errors = validate(inputs, validationRule, { format: "flat" });
        if (errors && errors.length > 0) {
            this.showToast(errors[0]); // TODO : move out of this file, affects tests
            return false;
        }

        return true;
    },



    // ---------------------- Stuff ----------------------


    days: function () {
        return [app.Strings.daysMon, app.Strings.daysTue, app.Strings.daysWed,
          app.Strings.daysThu, app.Strings.daysFri, app.Strings.daysSat,
          app.Strings.daysSun];
    },


    // Returns the index number of today from 0 to 6 where 0 is Monday
    getTodayIndex: function (date) {
        var d = date ? date.getDay() : new Date().getDay();
        d = d - 1;
        if (d == -1) d = 6;
        return d;
    },


    // Returns todays name (eg. WED)
    getTodayName: function (date) {
        return this.days()[this.getTodayIndex(date)];
    },


    // Returns tomorrows name (eg. WED)
    getTomorrowName: function (date) {
        var d = this.getTodayIndex(date) + 1;
        if (d > 6) d = 0;

        return this.days()[d];
    },


    // TODO : i18n
    // First letter of each word in a string to uppercase
    // https://stackoverflow.com/a/4878800
    toTitleCase: function(str) {
        if (!str) return "";

        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },




    // jquery-template formatters
    setupTemplateFormatters: function () {
        $.addTemplateFormatter({
            lowestOptionPriceFormatter: function (value) {
                return app.Strings.fromDollar + value;
            },
            priceFormatter: function (value) {
                return app.Strings.fromDollar + value.toFixed(2);
            },
            categoryArrayFormatter: function(value) {
                return value.join(", ");
            },
            phoneNumberFormatter: function(value) {
                return app.Strings.phone + " " + value;
            },
            deliveryFormatter: function(value) {
                return app.Strings.delivery + " " + value;
            },
            minOrderFormatter: function(value) {
                return app.Strings.minOrder + " " + value;
            },
        });
    },



    // TODO : this being used ?
    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
    },



    // Show toast
    showToast: function (message, timeout, cssClass) {
        var $toasts = $("#toasts");
        var $toast = $("<p class='" + (cssClass || "") + "'>" + message + "</p>");

        // remove toasts if there's too many stacked up
        if ($toasts.children().length >= 5) {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });
        }

        // append toasts message and show toasts
        $toasts.append($toast[0]);
        $toasts.show();

        $toast.animate({ opacity: 1, bottom: 0 }, 100);

        // hide toast after a little bit
        setTimeout(function () {
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


    // Load a jquery-template template and return it
    loadTemplate: function (templateEl, data, itemId, idName) {
        var $item = $("<div></div>")
            .loadTemplate($(templateEl), data, { isFile: false });

        $item = $item.children().first().unwrap();

        if (idName) {
            $item.attr(idName, itemId);
        }

        return $item;
    },







    // ---------------------- Ajax ----------------------

    // TODO : check what happens on length error
    // check if jwt from local storage is valid
    checkToken: function (callback) {
        var self = this;
        var jwt = app.data.getJwtFromStorage();

//        if (jwt && jwt.length > 30) { // TODO : add a regex check or something
        if (!app.util.validateInputs(jwt, app.validationRules._people_jwt)) {
            app.data.invalidateTokensAndGoToLogin();
            return callback(app.Strings.invalidToken);
        }

        this.ajaxRequest({
            method: "POST", url: "/api/v1/check-token", auth: true
        }, function (err, result) {
            if (err) {
                console.log(err);
                self.invalidateCredentials();
                return callback(app.Strings.invalidToken);
            }

            app.data.addJwtToStorage(result.data.jwt);
            app.data.addPersonIdToStorage(result.data.id_person);
            if (result.data.id_store && result.data.id_store > 0) {
                app.data.addStoreIdToStorage(result.data.id_store);
            }

            return callback(null);
        });
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
        if (files && files.length > 0) {
            var file = files[0];
            if (file.size > 250000) {
                this.showToast(app.Strings.imageFileTooBig);
                return;
            }

            var formdata = new FormData();
            formdata.append("logo", files[0]);
            formdata.append("id_store", app.data.getStoreIdFromStorage());

            this.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-logo", auth: true,
                isImage: true, data: formdata
            }, function (err, result) {
                if (err || !result || !result.data || !result.data.url) {
                    console.log(err)
                    return callback(app.Strings.errorUploadingImage);
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
            this.showToast(app.Strings.invalidImage);
        }
    },


    // TODO : check jwt before ajax
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
            beforeSend: function(xhr) {
                if (options.auth) {
                    var jwt = app.data.getJwtFromStorage();

                    if (!app.util.validateInputs({ jwt: jwt }, app.validationRules.jwt)) {
                        xhr.abort();
                        app.data.invalidateTokensAndGoToLogin();
                        return callback(app.Strings.invalidToken);
                    }

                    xhr.setRequestHeader("authorization", "Bearer " + jwt);
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
                        self.showToast(app.Strings.serverError, 4000);
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

    _product_extras_name:                    { presence: true, length: { maximum: 32 }},

    _product_options_name:                   { presence: true, length: { maximum: 32 }},

    _products_name:                          { presence: true, length: { maximum: 64 }},
    _products_description_optional:          { length: { maximum: 256 }},

    _order_products_customer_notes_optional: { length: { maximum: 256 }},

    _orders_notes_optional:                  { length: { maximum: 256 }},
    _orders_expiry:                          { presence: true, datetime: true }, // TODO: does this work

    _transactions_commission:                { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }, // TODO : is 1000 ok
    _transactions_processing_fee:            { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } },

}







// These validation objects below use the values from above


// jwt
app.validationRules.jwt = {
	jwt: app.validationRules._people_jwt
}


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


// TODO : i18n
// Validates a business hours object
// checks time is HH:MM and gives if only one open/close time is null
app.validationRules.validateHours = function (data) {
    if (!data || Object.keys(data).length === 0) {
        return "Data missing";
    }

    var temp = null;
    var text = null;
    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("hours_") === 0) {

            if (data[keys[i]]) {
                if (data[keys[i]].length !== 5 || !data[keys[i]].match(/\d{2}:\d{2}/)) {
                    temp = keys[i].split("_");
                    text = temp[1] + " " + temp[2] + " " + temp[3];
                    text = app.util.toTitleCase(text);
                    return "Error in Hours " + text + ".  Must be HH:MM";
                }

            // both times have to be null
            } else {
                temp = keys[i].split("_");
                var check = temp[3] === "open" ? "close" : "open";

                text = temp[1] + " " + temp[2] + " " + temp[3];
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






// app.validationRules.storeUpdateBankDetails = {
//     bank_name: app.validationRules._stores_bank_name,
//     bank_bsb: app.validationRules._stores_bank_bsb,
//     bank_account_name: app.validationRules._stores_bank_account_name,
//     bank_account_number: app.validationRules._stores_bank_account_number
// }







// Scroller on store and cms menu pages
app.controls.CategoryScroller = function (categories, v1, v2) {
    var self = this;

    this.$html = $("html");
    var scrollerListEl = ".category-scroller-list";
    var $categoryScrollerContainer = $(".category-scroller-container");
    var $categoryScroller = $(".category-scroller");
    var $categoryScrollerList = $(scrollerListEl);
    var $categoryScrollerListItems = [];

    var i = 0;
    this.headingPositions = [];
    var verticalOffset1 = v1;
    var verticalOffset2 = v2;


    // Sets the active heading
    function setActiveHeading () {
        var st = self.$html.scrollTop();
        for (i = self.headingPositions.length - 1; i >= 0; i--) {
            if (st > self.headingPositions[i] - 110) {
                $categoryScrollerListItems.removeClass("active");
                $($categoryScrollerListItems[i]).addClass("active");
                break;
            }
        }
    }


    // Add items to scroller
    var $item = null;
    var frag = document.createDocumentFragment();
    for (i = 0; i < categories.length; i++) {
        $item = $("<li class='store-menu-nav-list-item'>" + categories[i].title + "</li>");
        frag.append($item[0]);
    }
    $categoryScrollerList.append(frag);


    // make scrollable
    new app.controls.HorizontalScroller(scrollerListEl, function (item) {

        // scroll item clicked
        var $el = $(".store-menu-list-item.heading:contains('" + item.innerText + "')");
        var verticalOffset = screen.width < 670 ? verticalOffset2 : verticalOffset1;

        if ($el[0]) {
            $("html").animate({
                scrollTop: $el[0].getBoundingClientRect().top +
                    self.$html.scrollTop() - verticalOffset
            }, 500);
        }
    });


    // window resized
    $(window).on("resize", function () {
        self.updateHeadingPositions();
        setActiveHeading();
    });


    // Change to floating navbar
    $(window).on("scroll", function () {
        if (!$categoryScrollerListItems.length) return;

        if ($categoryScrollerContainer[0].getBoundingClientRect().top < 20) {
            $categoryScroller.addClass("floating");
        } else {
            $categoryScroller.removeClass("floating");
        }

        setActiveHeading();
    });


    // get scroller items for highlighting and update heading positions
    $categoryScrollerListItems = $(".store-menu-nav-list-item");
    this.updateHeadingPositions();
}

// update the position of the headings from the top of the screen
app.controls.CategoryScroller.prototype.updateHeadingPositions = function () {
    var self = this;
    self.headingPositions = [];

    $(".store-menu-list-item.heading").each(function () {
        self.headingPositions.push(
            this.getBoundingClientRect().top + self.$html.scrollTop()
        );
    });
}

// Navbar

app.controls.Navbar = function () {
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
        $(".rating-control-star").off();
        $(".rating-control-star").unbind();


        // has the user used this star control before
        var isUnused = false;


        // Rating control star clicked
        $(".rating-control-star").on("click", function () {
            if (!$(this).hasClass("active") && !$(this).siblings().hasClass("active")) {
                isUnused = true;
            }

            console.log(isUnused)
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
// Creates a vertical or horizontal resizer
app.controls.Resizer = function (direction, handle, container, offset, resizeCallback) {

    var $handle = $(handle);
    var $container = $(container);

    var startX = 0;
    var startY = 0;
    var mouseIsDown = false;
    var currentHeight = 0;


    $handle.on("mousedown", function (e) {
        mouseIsDown = true;
        startX = e.clientX;
        startY = e.clientY;

        console.log(startX, startY)
    });


    $(window).on("mousemove", function (e) {
        e.preventDefault();

        if (mouseIsDown) {
            $container.show();
            currentHeight = window.innerHeight - e.clientY - offset;
            $container.height(currentHeight);

            if (resizeCallback) resizeCallback();
        }
    });


    $(window).on("mouseup", function () {
        mouseIsDown = false;
    });


//    if (direction === "vertical") {
//
//    } else if (direction === "horizontal") {
//
//    } else {
//        throw new Error("Unknown Resizer direction: " + direction);
//    }


}

// Horizontal scroller
app.controls.HorizontalScroller = function (scrollerListEl, clickCallback) {
    var self = this;

    var mouseIsDown = false;
    this.startMouseX = 0;
    var startPosX = 0;
    var scrollTriggered = false;
    this.diff = 0;

    this.scrollBlurTolerance = 5;

    this.$scrollerList = $(scrollerListEl);
    this.$scrollBlurLeft = this.$scrollerList.prev();
    this.$scrollBlurRight = this.$scrollerList.next();


    // start
    this.$scrollerList.on("mousedown", function (e) {
        mouseIsDown = true;
        scrollTriggered = false;
        self.startMouseX = e.clientX;
        startPosX = $(this).scrollLeft();
    });


    // scrolling
    $(window).on("mousemove", function (e) {
        if (mouseIsDown) {
            e.stopPropagation();
            self.$scrollerList.scrollLeft(startPosX - (e.clientX - self.startMouseX));

            if (!self.isInsideTolerance(e.clientX)) {
                scrollTriggered = true;
            }
        }
    });


    // stop
    $(window).on("mouseup", function () {
        mouseIsDown = false;
    });


    // click callback if mouse doesn't move much
    this.$scrollerList.on("mouseup", function (e) {
        if (!scrollTriggered) {
            return clickCallback(e.target);
        }

        scrollTriggered = false;
    });


    // scroll event
    this.$scrollerList.on("scroll", function () {
        self.updateScrollBlurs();
    });


    // Window resize
    $(window).on("resize", function () {
        self.updateScrollBlurs();
    });


    this.updateScrollBlurs();
}



// turn blurs on or off
app.controls.HorizontalScroller.prototype.updateScrollBlurs = function () {
    if (this.$scrollerList[0].scrollLeft > this.scrollBlurTolerance) {
        this.$scrollBlurLeft.show();
    } else {
        this.$scrollBlurLeft.hide();
    }

    if (this.$scrollerList[0].scrollLeft + this.$scrollerList[0].clientWidth < this.$scrollerList[0].scrollWidth - this.scrollBlurTolerance) {
        this.$scrollBlurRight.show();
    } else {
        this.$scrollBlurRight.hide();
    }
}


// is outside tolerance
app.controls.HorizontalScroller.prototype.isInsideTolerance = function (clientX) {
    this.diff = clientX - this.startMouseX;
    return (this.diff >= -this.scrollBlurTolerance && this.diff <= this.scrollBlurTolerance);
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
            self.setValue(data.postcode, data.suburb);
        } else {
            self.$typeaheadInput.attr("data-suburb", "");
            self.$typeaheadInput.attr("data-postcode", "");
            self.$typeaheadInput.val("");
        }
    });


    // when typing, generate dropdown list
    this.$typeaheadInput.on("keyup", function (e) {

        var i = 0;
        var items = [];
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
            items = $(".typeahead-item");
            for (i = 0; i < items.length; i++) {
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
            items = $(".typeahead-item");
            for (i = items.length - 1; i >= 0; i--) {
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
                for (i = 0; i < result.data.length; i++) {
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
                        "<li class='typeahead-item'>" + app.Strings.noResults + "</li>");
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
