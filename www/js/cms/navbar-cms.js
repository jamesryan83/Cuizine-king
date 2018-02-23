
// Cms navbar
app.cms.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);
        var noClick = false;

        // set active page
        $(".navbar-links a").removeClass("active");
        $(".navbar-link-" + (routeData.file)).addClass("active");


        // add store id's to links
        var storeId = app.data.getStoreIdFromStorage();
        $("#navbar-cms a").each(function () {
            var href = $(this).attr("href");
            $(this).attr("href", href.replace(":storeId", storeId));
        });


        // link clicked
        navbar.linkClicked = function (e, route) {

            // prevent clicking too much
            if (noClick) return;
            noClick = true;
            setTimeout(function () {
                app.routerBase.loadPageForRoute(route, "cms");
                noClick = false;
            }, 250);

            return false;
        }


    },

}