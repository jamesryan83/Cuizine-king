
// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                app.routerBase.loadPageForRoute("/location/" + url, "site");
            }
        });


        app.storeContent.init(routeData);


        // Store id
        var id_store = routeData.route.split("/");
        id_store = id_store[id_store.length - 1];

        app.storeContent.id_store = id_store;

        // Get the store data
        app.storeContent.getStoreData(function (storeData) {
            if (storeData) {
                storeData.id_store = app.storeContent.id_store;
                app.storeContent.addStoreDetailsDataToPage(storeData);
                app.storeContent.addMenuDataToPage(storeData);
            }
        });


        // Resize heading when window resizes
        $(window).on("resize blur focus", function () {
            setTimeout(function () {
                self.resizeLocationHeading();
            }, 400); // doesn't always work without delay
        });

    },


    resizeLocationHeading: function () {

    },


}
