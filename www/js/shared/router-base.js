
// Base client side router
app.routerBase = {


    firstLoad: true,
    lastLoadedSection: "",
    isLoading: false,


    // Init
    init: function () {

        // For Cordova
        document.addEventListener("deviceready", function () {
            app.cordova.init();
        }, false);
    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;

        if (this.isLoading) return;
        if (window.location.pathname === route && !isAfterPopState) return; // same page

        this.isLoading = true;
        this.lastLoadedSection = section;


        // reset window events // TODO : test is working
        $(window).off();
        $(document).off();


        // for back button after pushstate
        window.onpopstate = function () {
            console.log("on popstate " + window.location.pathname);
            self.loadPageForRoute(window.location.pathname, self.lastLoadedSection, true);
        };


        // get data for route
        var newRoute = route || window.location.pathname;
        var routeData = { route: newRoute };
        if (app.util.isCordova()) {
            // remove extra cordova stuff from route
            newRoute = newRoute.substring(newRoute.lastIndexOf("/"), newRoute.length - 5);
            if (newRoute == "/index-cordova") newRoute = "/";
        }

        // normalize route and add current section
        routeData.normalizedRoute = app[section].normalizeRoute(newRoute).route;
        routeData.section = section;


        // Add html and other route data
        if (app[section].routesList.indexOf(routeData.normalizedRoute) !== -1) {
            routeData.html = app[section].htmlFiles[routeData.normalizedRoute];
            $.extend(routeData, app[section].routes[routeData.normalizedRoute]);

        // unknown route
        } else {
            debugger;
            app.data.invalidateTokensAndGoToLogin();
            return;
        }


        // load html into page
        $("#page-container").empty();
        $("#dialog-container").empty();
        $("#page-container").append(routeData.html);

        $("html, body").animate({ "scrollTop": 0 }, 200);


        // start js
        app[section].routes[routeData.normalizedRoute].initFunction(routeData);
        app[section].onPageChanged(routeData);


        // run ui stuff when page is loaded
//        setTimeout(function () {
            $("body").css("visibility", "visible");
//        }, 0);


        // push route into history, but not on back
        if (!this.firstLoad && !isAfterPopState) {
            if (routeData.route != window.location.pathname) {
                window.history.pushState(null, routeData.route, routeData.route);
            }
        }

        this.firstLoad = false;
        this.isLoading = false;

        return routeData;
    },



    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/logout", auth: true
        }, function () {
            app.data.invalidateTokensAndGoToLogin();

        });
    },



    // Get if the user is logged in
    isUserLoggedIn: function () {
        var jwt = app.data.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },

}


if (typeof module !== "undefined" && this.module !== module) {
    exports = module.exports = app.routerBase;
}