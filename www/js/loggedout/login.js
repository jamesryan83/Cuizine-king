"use strict";

var app = app || {};


app.login = {


    init: function (routeData) {
        // cached incase the user wants to resend the verification
        // email from the registration success thing
        var registrationData = undefined;


        if (routeData.route == "/login") {
            $("#form-login").removeClass("hidden");
            $("#form-register").addClass("hidden");
            $("#form-register-store").addClass("hidden");
        }

        if (routeData.route == "/store-login") {
            $("#form-store-login").removeClass("hidden");
            $("#form-login").addClass("hidden");
        }

        if (routeData.route == "/register") {
            $("#form-login").addClass("hidden");
            $("#form-register").removeClass("hidden");
            $("#form-register-store").addClass("hidden");
        }

        if (routeData.route == "/register-store") {
            $("#form-login").addClass("hidden");
            $("#form-register").addClass("hidden");
            $("#form-register-store").removeClass("hidden");
        }


        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/login", data, function (err, result) {
                if (err) return false;

                if (!result.jwt) alert("jwt missing");

                // add token to storage for api calls later
                app.util.addJwtToStorage(result.jwt);

                window.location.href = "/";
            });

            return false;
        });


        // Submit store login form
        $("#form-store-login").on("submit", function () {
            window.location.href = "/dashboard";

//            var data = validate.collectFormValues($("#form-store-login")[0], { trim: true });
//
//            if (!app.util.validateInputs(data, app.validationRules.login))
//                return false;
//
//            app.util.ajaxRequest("POST", "/api/v1/store-login", data, function (err, result) {
//                if (err) return false;
//
//                if (!result.jwt) alert("jwt missing");
//
//                // add token to storage for api calls later
//                app.util.addJwtToStorage(result.jwt);
//
//                window.location.href = "/dashboard";
//            });

            return false;
        });



        // Submit register form
        $("#form-register").on("submit", function () {
            if (!$("#checkbox-tnc").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-register")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.peopleCreate))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/register", registrationData, function (err) {
                if (err) return;

                $("#form-register").addClass("hidden-other");
                $("#registration-success").removeClass("hidden");
                $("#registration-success-email").text(registrationData.email);
            });

            return false;
        });


        // Submit register store form
        $("#form-register-store").on("submit", function () {
            if (!$("#checkbox-tnc-store").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-register-store")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.registerStore))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/register-store", registrationData, function (err) {
                if (err) return;

                $("#form-register-store").addClass("hidden-other");
                $("#registration-success").removeClass("hidden");
                $("#registration-success-email").text(registrationData.email);
            });

            return false;
        });


        // Send forgot password email
        $("#form-forgot-password").on("submit", function () {
            var email = validate.collectFormValues(this, { trim: true });
            if (!app.util.validateInputs(email, app.validationRules.forgotPassword))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/forgot-password", email, function (err, data) {
                if (!err && data) {
                    app.util.showToast(data.message, 4000);
                }
            });

            return false;
        });



        // TODO : try to minimise this stuff a bit
        // ----------- Buttons -----------

        // login goto register
        $("#login-goto-register").on("click", function () {
            $("#form-register").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Register";
            window.history.pushState(null, "register", "register");
        });


        // login goto store login
        $("#login-goto-store-login").on("click", function () {
            $("#form-store-login").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Store Login";
            window.history.pushState(null, "store-login", "store-login");
        });


        // store login goto login
        $("#store-login-goto-login").on("click", function () {
            $("#form-store-login").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // login goto register store
        $("#login-goto-register-store").on("click", function () {
            $("#form-register-store").removeClass("hidden");
            $("#form-login").addClass("hidden");

            $("#navbar-login").removeClass("active");
            document.title = "Register Store";
            window.history.pushState(null, "register-store", "register-store");
        });


        // login goto forgot password
        $("#login-forgot-password").on("click", function () {
            $("#form-login").addClass("hidden");
            $("#form-forgot-password").removeClass("hidden");
        });


        // register goto login
        $("#register-goto-login").on("click", function () {
            $("#checkbox-tnc").prop("checked", false);
            $("#form-register").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // register store goto login
        $("#register-store-goto-login").on("click", function () {
            $("#checkbox-tnc-store").prop("checked", false);
            $("#form-register-store").addClass("hidden");
            $("#form-login").removeClass("hidden");

            $("#navbar-login").addClass("active");
            document.title = "Login";
            window.history.pushState(null, "login", "login");
        });


        // forgot password goto login
        $("#forgot-password-goto-login").on("click", function () {
            $("#form-login").removeClass("hidden");
            $("#form-forgot-password").addClass("hidden");
        });


        // Resend registration email button
        $("#registration-success-resend").on("click", function () {
            if (!registrationData) {
                app.util.showToast("Unable to send email.  Please refresh the page", 4000);
                return;
            }

            app.util.ajaxRequest("POST", "/api/v1/registration-email", registrationData, function (err) {
                if (err) return;

                app.util.showToast("Registration email has been resent.  Please check your emails");
            });
        });




    },


}

