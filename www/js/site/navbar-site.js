
// Site navbar
app.site.navbar = {

    init: function (routeData) {
        var navbar = new app.controls.Navbar(routeData);

        $(".navbar-links a").removeClass("active");

        // don't use blue underline thing on some routes
        var r = routeData.route;
        if (r.indexOf("/location/") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }

        // if logged in
        if (app.routerBase.isUserLoggedIn()) {
            $(".navbar-link-logout").show();
            $(".navbar-link-account").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
            $(".navbar-link-logout").hide();
            $(".navbar-link-account").hide();
        }


        // link clicked
        navbar.linkClicked = function (e, route) {
            if (e.target.innerText.toLowerCase() == "blog") {
                app.util.showToast("Not working yet");
                return false;
            }

            if (e.target.innerText.toLowerCase() == "account") {
                app.routerBase.loadPageForRoute("/account/" + app.util.getPersonIdFromStorage(), "site");
                return false;
            }

            app.routerBase.loadPageForRoute(route, "site");

            return false;
        };
    },

}