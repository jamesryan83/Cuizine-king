
// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
        });


        app.storeContent.init(routeData);


        // Store id
        var id_store = routeData.route.split("/");
        id_store = id_store[id_store.length - 1];


        // Get the store data
        app.storeContent.getStoreData(id_store, function (storeData) {
            if (storeData) {
                storeData.id_store = id_store;
                app.storeContent.addStoreDetailsDataToPage(storeData);
                app.storeContent.addMenuDataToPage(storeData);
            }
        });

    },
}
