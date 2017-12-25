"use strict";

var app = app || {};


app.home = {


    // Init
    init: function (routeData) {
        var self = this;


        // suburb typeahead
        new app.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            app.clientRouter.loadPageForRoute("/location/" + data.suburb + "-" + data.postcode);
        });


        $("#navbar-icon").on("click", function () {
            window.location.href = "/location/Balmoral-4171";
        });


        // TODO: get users lat long
//        // Get users location
//        app.util.getUserLatLong(function (result) {
//            if (result) {
//                console.log(result)
//            }
//        });
    },

}