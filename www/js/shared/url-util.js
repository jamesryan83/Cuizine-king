
if (typeof app === "undefined") {
    var app = {};
}

// Parses urls that have variables
app.urlUtil = {

    // url regexes
    regexUrlAccount: /\/account\/\d*/,
    regexUrlLocation: /\/location\/[\w\d%-]*-\d*/,
    regexUrlStoreAdmin: /\/store-admin\/\d*\/([\w-]*)/,
    regexUrlStore: /\/store\/\d*/,


    // replace url variables with url placeholders
    normalizeRoute: function (route) {

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

        return route;
    },

}


if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.urlUtil;
}