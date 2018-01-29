

// Base client side router
app.routerBase = {


    // url regexes
    regexUrlStore: /\/store\/\d*/,
    regexUrlAccount: /\/account\/\d*/,
    regexUrlLocation: /\/location\/[\w\d%-]*-\d*/,
    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,

    firstLoad: true,
    lastSection: "",


    // Init
    init: function () {
        var self = this;

        // For Cordova
        document.addEventListener("deviceready", function () {
            app.cordova.init();
        }, false);


    },



    // Load page into #page-container.  This is called to change a page
    // section is site, cms or sysadmin
    loadPageForRoute: function (route, section, isAfterPopState) {
        var self = this;
        this.lastSection = section;


        // reset window events // TODO : test is working
        $(window).off();
        $(document).off();


        // for back button after pushstate
        window.onpopstate = function () {
            self.loadPageForRoute(window.location.pathname, self.lastSection, true);
        };


        // get data for route
        var routeData = this.getCurrentRouteData(route, section);

console.log(routeData)
        // load html into page
        $("#page-container").empty();
        $("#page-container").append(routeData.html);


        // start js
        app[section].routes[routeData.normalizedRoute].initFunction(routeData);
        app[section].onPageChanged(routeData);


        // run ui stuff when page is loaded
        setTimeout(function () {
            $("body").css("display", "block");

            // push route into history, but not on back
            if (!self.firstLoad && !isAfterPopState) {
                if (routeData.route != window.location.pathname) {
                    window.history.pushState(null, routeData.route, routeData.route);
                }
            }

            self.firstLoad = false;
        }, 0);


        document.title = routeData.title;

        return routeData;
    },




    // Returns the data for the current route
    getCurrentRouteData: function (route, section) {
        var route = route || window.location.pathname;
        var routeData = { route: route };

        if (app.util.isCordova()) {
            // remove extra cordova stuff from route
            route = route.substring(route.lastIndexOf("/"), route.length - 5);
            if (route == "/index-cordova") route = "/";
        }

        // replace variables with placeholders
        if (this.regexUrlStoreAdmin.exec(route)) {
            var temp = route.split("/");
            route = "/store-admin/:id/" + temp[temp.length - 1];
        } else if (this.regexUrlStore.exec(route)) {
            route = "/store/:id";
        } else if (this.regexUrlLocation.exec(route)) {
            route = "/location/:suburb";
        } else if (this.regexUrlAccount.exec(route)) {
            route = "/account/:id";
        }

        routeData.normalizedRoute = route;
        routeData.section = section;

        // Add html and other route data
        if (app[section].routesList.indexOf(route) !== -1) {
            routeData.html = app[section].htmlFiles[route];
            $.extend(routeData, app[section].routes[route]);

        // unknown route
        } else {
            window.location.href = "/login";
            return;
        }

        return routeData;
    },



    // Log a user out, invalide their jwt and redirect to /login
    logUserOut: function () {
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/logout", auth: true
        }, function (err) {
            app.util.invalidateCredentials();
            window.location.href = "/login";
        });
    },



    // Get if the user is logged in
    isUserLoggedIn: function () {
        var jwt = app.util.getJwtFromStorage();
        return jwt && jwt.length > 30; // TODO : something better
    },

}
