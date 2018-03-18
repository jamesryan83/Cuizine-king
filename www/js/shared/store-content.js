

// Store content
// This is the details and menu sections used on the store page and edit store page
app.storeContent = {

    init: function (section) {

        this.$storeInfo = $("#store-info");
        this.$logo = $(".store-info-image");
        this.$menuList = $("#store-menu-list");
        this.$logoEmpty = $(".store-info-image-empty");
        this.$description = $("#store-info-description");
        this.$hoursButton = $("#store-info-button-hours");
        this.$logoLoading = $(".store-info-image-loading");
        this.$reviewsButton = $("#store-info-button-reviews");
        this.$descriptionButton = $("#store-info-button-description");
        this.$descriptionContainer = $("#store-info-description-container");

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


        // Setup dialogs
        app.dialogs.addDialog(app[section].htmlFiles.dialog_businessHours);
        app.dialogs.businessHours.init();
        app.dialogs.addDialog(app[section].htmlFiles.dialog_description);
        app.dialogs.description.init();
        app.dialogs.addDialog(app[section].htmlFiles.dialog_reviews);
        app.dialogs.reviews.init();
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


        // add store details
        $("#store-header-name").text(data.name);
        this.$description.text(data.description);
        $("#store-info-address").text(data.addressString);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-review-count").text("( " + data.review_count + " )");

        // TODO : make the 'more' button for the description only show when required

        // TODO : isOpen etc.
        // hours
        $("#store-info-hours-is-open").text();
        $("#store-info-hours-opens-at").text();


        // rating control
        app.controls.RatingControls.setValue(
            "#store-info-rating-control", Math.round(data.rating));


        // Setup dialogs
        app.dialogs.businessHours.update(data.hours);
        app.dialogs.description.update(data.name, data.description);
        app.dialogs.reviews.update(data);


        // Events
        $(window).on("resize", function () {
            self.resizeDescription();
        });

    },



    // Add menu data
    addMenuDataToPage: function (data) {
        var self = this;

        if (!data.products) {
            this.$menuList.append(app.Strings.noProducts);
            return;
        }

        var i = 0, j = 0;
        var $item = null;
        var item = null;
        var frag = document.createDocumentFragment();

        // create product items
        for (i = 0; i < data.products.length; i++) {
            item = data.products[i];


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

