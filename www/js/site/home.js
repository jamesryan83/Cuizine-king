
// Home page
app.site.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                app.routerBase.loadPageForRoute("/location/" + url, "site");
            }
        });

    },

}