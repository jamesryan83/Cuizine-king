"use strict";

// Logged out navbar

var app = app || {};


app.navbar = {

    init: function (routeData) {

        app.util.preloadImages("/res/svg/", [
            "icon-navbar-active.svg", "icon-close-hover.svg"]);


        // Item clicked
        $(".navbar a").on("click", function () {
            if (this.innerText == "blog" || this.innerText == "account")
                return false;

            var route = this.href.replace(window.location.origin, "");
            app.clientRouter.loadPageForRoute(route);

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
            }
        });

        this.updateNavbar(routeData);
    },


    // Update the navbar when the route changes
    updateNavbar: function (routeData) {
        var r = routeData.route;

        $(".navbar-links a").removeClass("active");

        if (r.indexOf("/location") === 0 || r == "/register" ||
            r == "/register-store" || r == "/store-login") {
            // ignore
        } else {
            console.log(routeData.file)
            $(".navbar-link-" + (routeData.file)).addClass("active");
        }

        // if logged in
        if (app.util.isLoggedIn()) {
            $(".navbar-link-dashboard").show();
            $(".navbar-link-logout").show();
            $(".navbar-link-login").hide();
        } else {
            $(".navbar-link-login").show();
        }
    }


}