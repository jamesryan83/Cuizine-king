

app.navbar = {


    // Init
    init: function (routeData) {
        var self = this;

        // Item clicked.  // TODO : security
        $(".navbar a").on("click", function (e) {
            var isCms = window.location.pathname.indexOf("/store-admin") === 0;

            if (this.innerText.toLowerCase() == "blog") {
                app.util.showToast("Not working yet");
                return false;
            }

            if (this.innerText.toLowerCase() == "account") {
                if (!isCms) {
                    app.routerBase.loadPageForRoute("/account/" + app.util.getPersonIdFromStorage(), "site");
                }
                return false;
            }

            if (this.innerText.toLowerCase() == "logout") {
                app.routerBase.logUserOut();
                return false;
            }


            var route = this.href.replace(window.location.origin, "");
            var section = "site";
            if (window.location.pathname.indexOf("/store-admin") === 0) {
                section = "cms";
                route = "/store-admin/" + app.util.getStoreIdFromStorage() + e.target.pathname;
            }

            var routeData = app.routerBase.loadPageForRoute(route, section);

            return false;
        });


        // Popup icon to show/hide
        $(".navbar-links-popup-button").on("click", function () {
            $(".navbar-links-popup").animate({ right: 0 }, 200);
        });

        $(".navbar-links-popup-close").on("click", function () {
            $(".navbar-links-popup").animate({ right: -250 }, 200);
        });


        // TODO : remove in production
        // Debug - go to sysadmin page when click on the icon
        $(".navbar-icon").on("click", function (e) {
            if (e.ctrlKey) {
                window.location.href = "/admin-login";
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
            $(".navbar-link-logout").show();
            $(".navbar-link-account").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
            $(".navbar-link-logout").hide();
            $(".navbar-link-account").hide();
        }
    }


}