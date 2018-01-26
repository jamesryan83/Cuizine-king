
// Page for a single store
app.site.store = {

    init: function (routeData) {
        var self = this;

        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
        });

        app.storeContent.init(routeData);
    },
}
