
// Navbar

app.controls.Navbar = function (routeData) {
    var self = this;


    // Item clicked
    $(".navbar a").on("click", function (e) {
        if (this.innerText.toLowerCase() == "logout") {
            app.routerBase.logUserOut();
            return false;
        }

        var route = this.href.replace(window.location.origin, "");
        self.linkClicked(e, route);

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
}

// Overridden elsewhere
app.controls.Navbar.prototype.linkClicked = function () { }
