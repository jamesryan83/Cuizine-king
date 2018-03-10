
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

            if (app.data.getStoreIdFromStorage()) {
                $(".navbar-link-dashboard").show();
            }
        } else {
            $(".navbar-link-login").show();
            $(".navbar-link-logout").hide();
            $(".navbar-link-account").hide();
            $(".navbar-link-dashboard").hide();
        }


        // suburb typeahead
        new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                app.routerBase.loadPageForRoute("/location/" + url, "site");
            }
        });


        // TODO : i18n
        // link clicked
        navbar.linkClicked = function (e, route) {
            if (e.target.innerText.toLowerCase() == "blog") {
                app.util.showToast(app.Strings.notWorkingYet);
                return false;
            }

            if (e.target.innerText.toLowerCase() == "account") {
                app.routerBase.loadPageForRoute("/account/" + app.data.getPersonIdFromStorage(), "site");
                return false;
            }

            if (e.target.innerText.toLowerCase() == "dashboard") {
                var sid = app.data.getStoreIdFromStorage();
                window.location.href = "/store-admin/" + sid + "/dashboard";
                return false;
            }

            app.routerBase.loadPageForRoute(route, "site");

            return false;
        };
    },

}