"use strict";

var app = app || {};


app.store = {

    init: function (routeData) {
        var self = this;

        $("#store-info-description").dotdotdot({ height: 92 });

        $.getJSON("/pages/store-page.json", function (data) {
            self.addDataToPage(data)
        });
    },


    addDataToPage: function (data) {

        $("#store-header-name").text(data.name);
        $("#store-info-description").text(data.description);
        $("#store-info-address").text(data.address);
        $("#store-info-phone-number").text(data.phone_number);
        $("#store-info-email").text(data.email);
        $("#store-disclaimer").text(data.disclaimer);
        $("#store-info-image").attr("src", data.logo);
    },

}