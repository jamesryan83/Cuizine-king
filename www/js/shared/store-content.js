

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

                if (item.gluten_free) item.class1 = "label-gluten-free";
                if (item.vegetarian) item.class2 = "label-vegetarian";
                if (!item.delivery_available) item.class3 = "label-takeaway";

                var $item = $("<div></div>")
                    .loadTemplate($("#template-store-menu-item"), item);

                $item = $item.children().first();
                $item.attr("data-product-id", item.id_product);
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

