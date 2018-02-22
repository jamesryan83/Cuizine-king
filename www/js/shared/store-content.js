

// Store content
// This is the details and menu sections used on the store page and edit store page
app.storeContent = {

    storeDataRequestNotAllowed: false,
    storeData: {},

    init: function () {

        this.$logo = $(".store-info-image");
        this.$description = $("#store-info-description");
        this.$logoEmpty = $(".store-info-image-empty");
        this.$logoLoading = $(".store-info-image-loading");
        this.$descriptionButton = $("#store-info-button-description");
        this.$menuList = $("#store-menu-list");

        this.$logoEmpty.hide();
        this.$logoLoading.show();

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
            this.$descriptionButton.show();
        } else {
            this.$descriptionButton.hide();
        }
    },


    // Add store details data
    addStoreDetailsDataToPage: function (data) {
        var self = this;


        // logo
        var logo = new Image();
        logo.src = "/res/storelogos/store" + this.id_store + ".jpg?" + Date.now();
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


        // rating control
        app.controls.RatingControls.setValue("#store-info-rating-control", Math.round(data.rating));


        // Setup dialogs
        app.dialogs.description.init(data.name, data.description);
        app.dialogs.businessHours.init(data.hours);
        app.dialogs.reviews.init(data);


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


            // Category scroller
            new app.controls.CategoryScroller(data.product_headings);

        } else {
            self.$menuList.append("No Products");
        }
    },



    // Gets the store data and caches it for a little while
    getStoreData: function (callback) {
        var self = this;

        // check if already running
        if (this.storeDataRequestNotAllowed) {
            return callback(this.storeData);
        }

        if (!app.util.validateInputs({ id_store: this.id_store }, app.validationRules.getStore))
            return false;


        // set timeout
        this.storeDataRequestNotAllowed = true;
        setTimeout(function () {
            self.storeDataRequestNotAllowed = false;
        }, 2000);


        // get data from server
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

