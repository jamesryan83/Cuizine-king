

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

