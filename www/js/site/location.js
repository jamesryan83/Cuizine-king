

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