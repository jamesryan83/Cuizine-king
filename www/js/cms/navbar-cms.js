
// Cms navbar
app.cms.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);


        // set active page
        $(".navbar-links a").removeClass("active");
        $(".navbar-link-" + (routeData.file)).addClass("active");


        // add store id's to links
        var storeId = app.util.getStoreIdFromStorage();
        $("#navbar-cms a").each(function (index, el) {
            var href = $(this).attr("href");
            $(this).attr("href", href.replace(":storeId", storeId));
        });


        // link clicked
        navbar.linkClicked = function (e, route) {
            app.routerBase.loadPageForRoute(route, "cms");
            return false;
        }

    },

}