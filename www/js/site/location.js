
// Location page with list of stores
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


        // load stores
        app.util.ajaxRequest({
            method: "GET", url: "/res/_stores.json"
        }, function (err, result) {
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
    },


    // After the store data is loaded
    afterStoreDataLoaded: function () {
        var locationsLength = -1;
        var locationsText = "";
        var storeData = null;


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
                "<hr class='hr-2' />");


            // add stores for category
            var frag = document.createDocumentFragment();
            for (var j = 0; j < this.storeData[i].stores.length; j++) {
                storeData = this.storeData[i].stores[j];

                // add the word 'store' to the id for the store el id
                storeData.storeId = "store" + storeData.id_store;

                var $item = app.util.loadTemplate(
                    "#template-store-list-item", storeData,
                    storeData.id_store, "data-store-id");

                // highlight open now
                if (storeData.open == "Open Now") {
                    $item.find(".store-list-item-text-open").addClass("active");
                }

                // add store image
                $item.find(".store-list-item-image")
                    .css({ "background-image": "url(" + storeData.image + ")" });

                // add review stars
                var starsRounded = Math.round(storeData.avgReview);
                var stars = $item.find(".rating-control-static > div");
                for (var k = 0; k < starsRounded; k++) {
                    $(stars[k]).addClass("active");
                }

                frag.append($item[0]);
            }


            // add stores to row
            var storeRow = $(
                "<div class='category-stores-row'>" +
                    "<div class='scroll-blur-left'></div>" +
                    "<div class='category-stores-row-inner'></div>" +
                    "<div class='scroll-blur-right'></div>" +
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

                // TODO : DEBUG : remove later
                storeId = 1;

                app.routerBase.loadPageForRoute("/store/" + storeId, "site");
            });
        });
    },

}