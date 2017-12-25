"use strict";

var app = app || {};


app.sysadmin = {

    init: function (routeData) {
        var self = this;

        new app.TabControl("#page-sysadmin-tabcontrol", function (tab) {

        });


        $("#form-create-store").on("submit", function () {
            var data = validate.collectFormValues($("#form-create-store")[0], { trim: true });

//            if (!app.util.validateInputs(data, app.validationRules.login))
//                return false;


            console.log(data)

//            app.util.ajaxRequest("POST", "/api/v1/create-store", data, function (err, result) {
//                if (err) return false;
//
//
//            });

            return false;
        });

    },

}