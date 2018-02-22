
// Home page
app.site.home = {


    // Init
    init: function () {

        // suburb typeahead
        new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                app.routerBase.loadPageForRoute("/location/" + url, "site");
            }
        });


        $("#download-app-logos > div").on("click", function () {
            app.util.showToast("Not working yet");
        });

    },

}