

// Store content
app.storeContent = {

    init: function (routeData, dataLoaded) {
        var self = this;

        this.$address = $("#store-info-address");
        this.$storeMenuNav = $("#store-menu-nav");
        this.$description = $("#store-info-description");


        // called from site section
        if (!dataLoaded) {
            // store id from url
            var storeId = routeData.route.split("/");
            storeId = storeId[storeId.length - 1];

            // Get store data
            app.util.ajaxRequest({
                method: "GET", url: "/api/v1/store", data: { id_store: storeId }, cache: true
            }, function (err, result) {
                if (err) return;
                console.log(result)
                result.data.id_store = storeId;
                self.addStoreDetailsDataToPage(result.data);
                self.addMenuDataToPage(result.data);
            });
        }


        // Other events
        $(window).on("resize", function () {
            self.resizeDescription();
        });


        $(window).on("scroll", function (e) {
            // position of menu category navigation thing
            var rect = document.getElementById("store-menu").getBoundingClientRect();
            if (rect.top < 0) {
                self.$storeMenuNav.css({ "position": "fixed", "right": 50, "top": 0, "float": "none" });
            } else {
                self.$storeMenuNav.css({ "position": "relative", "right": "auto", "top": "auto", "float": "left" });
            }
        });


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



    // Returns the data from the page
    getDataFromPage: function () {
        var data = {
            description: this.$description[0].innerText,
            postcodeSuburb: this.$address.attr("data-postcode-suburb"),
            addr1: this.$address.attr("data-addr1"),
            addr2: this.$address.attr("data-addr2")
        };

        return data;
    },



    // add data to the page
    addDataToPage: function (data) {
        console.log(data);

        $("#store-info-button-hours").show();
        $("#store-info-button-reviews").show();

        this.resizeDescription();
    },



    // Add store details data
    addStoreDetailsDataToPage: function (data) {

        // Format address to a single string
        var address = data.address[0];
        address = address.line1 + ", " +
            (address.line2 ? (address.line2 + ", ") : "") +
            address.suburb + " " + address.postcode;


        // add store details
        $("#store-header-name").text(data.name);
        $("#store-info-image").attr("src", "/res/storelogos/store" + data.id_store + ".jpg");
        $("#store-info-description").text(data.description);
        $("#store-info-address").text(address);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-review-count").text("( " + data.review_count + " )");


        // rating control
        app.controls.RatingControls.setValue("#store-info-rating-control", Math.round(data.rating));
    },



    // Add menu data
    addMenuDataToPage: function (data) {

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


            // Category nav
            frag = document.createDocumentFragment();
            for (var i = 0; i < data.product_headings.length; i++) {
                frag.append($("<li class='store-menu-nav-list-item'>" + data.product_headings[i].title + "</li>")[0])
            }
            $("#store-menu-nav-list").append(frag);

            $(".store-menu-nav-list-item").on("click", function (e) {
                var el = $(".store-menu-list-item-group-heading:contains('" + e.target.innerText + "')");

                if (el[0]) {
                    $("html").animate({ scrollTop: el[0].offsetTop - 30 }, 500);
                }
            });



        } else {
            $("#store-menu-list").append("No Products");
        }
    },

}














        // Checkout




        // Setup dialogs
//        app.dialogs.description.init(data.name, data.description);
//        app.dialogs.businessHours.init(data.hours);
        //app.dialogs.reviews.init(data);