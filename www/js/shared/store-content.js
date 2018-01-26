

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