
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead(function (data) {
            if (data) {
                app.routerBase.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode, "site");
            }
        });

    },

}