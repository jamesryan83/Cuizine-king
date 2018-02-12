
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
        });

    },

}