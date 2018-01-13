

app.navbar = {


    // Init
    init: function (routeData) {
        var self = this;

        // Item clicked
        $(".navbar a").on("click", function () {
            if (this.innerText == "blog" || this.innerText == "account")
                return false;

            var route = this.href.replace(window.location.origin, "");

            var routeData = app.routerBase.loadPageForRoute(route, "site");

            return false;
        });


        // Popup icon to show/hide
        $(".navbar-links-popup-button").on("click", function () {
            $(".navbar-links-popup").animate({ right: 0 }, 200);
        });

        $(".navbar-links-popup-close").on("click", function () {
            $(".navbar-links-popup").animate({ right: -200 }, 200);
        });


        // Debug - go to sysadmin page when click on the icon
        $(".navbar-icon").on("click", function (e) {
            if (e.ctrlKey) {
                window.location.href = "/sysadmin";
            } else {
                window.location.href = "/location/Balmoral-4171";
            }
        });

        this.updateNavbar(routeData);
    },


    // Update the navbar when the route changes
    updateNavbar: function (routeData) {
        var r = routeData.route;

        $(".navbar-links a").removeClass("active");

        if (r.indexOf("/location/") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }

        // if logged in
        if (app.routerBase.isUserLoggedIn()) {
            $(".navbar-link-dashboard").show();
            $(".navbar-link-logout").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
        }
    }


}