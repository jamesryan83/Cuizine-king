"use strict";

var app = app || {};
app.main = app.main || {};


// Business page
app.main.business = {

    init: function () {
        var self = this;

        $("#main-account-save").on("click", function () {
            var data = validate.collectFormValues($("#form-main-account")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.mainAccountSave))
                return false;

            console.log(data)

            return false;
        });


        $("#main-account-change-password").on("click", function () {
            var email = $("label[name='email']").text();

            if (!app.util.validateInputs({ email: email }, app.validationRules.forgotPassword))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/forgot-password", { email: email }, function (err, data) {
                if (!err && data) {
                    app.util.showToast(data, 4000);
                }
            });
        });


        $("#main-account-delete-account").on("click", function () {
            console.log("delete-account")
        });


        // Get account data
        app.util.ajaxRequest("GET", "api/v1/me", { auth: true }, function (err, result) {
            if (err) return;

            // add data to ui
            for (var propName in result) {
                var el = $("[name='" + propName + "']");
                if (el.prop("nodeName") === "INPUT") {
                    $(el).val(result[propName]);
                } else if (el.prop("nodeName") === "IMG") {
                    $(el).attr("src", result[propName]);
                } else {
                    $(el).text(result[propName]);
                }
            }
        });
    },

}