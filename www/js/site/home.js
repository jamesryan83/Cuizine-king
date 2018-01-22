
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
        });


        // TODO: get users lat long
//        // Get users location
//        app.util.getUserLatLong(function (result) {
//            if (result) {
//                console.log(result)
//            }
//        });



    },

}