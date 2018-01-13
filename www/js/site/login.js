

app.site.login = {


    init: function (routeData) {
        var self = this;

        // cached incase the user wants to resend the verification
        // email from the registration success thing
        var registrationData = undefined;


        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/login", data, function (err, result) {
                if (err) return false;

                if (!result.data.jwt) alert("authentical token missing");

                // add token to storage for api calls later
                app.util.addJwtToStorage(result.data.jwt);

                window.location.href = "/";
            });

            return false;
        });



        // Submit store login form
        $("#form-store-login").on("submit", function () {
            window.location.href = "/store/1/dashboard";

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


        // Submit store application form
        $("#form-store-application").on("submit", function () {
            if (!$("#checkbox-tnc-store").is(":checked")) {
                app.util.showToast("You need to agree to the terms and conditions");
                return false;
            }

            registrationData = validate.collectFormValues($("#form-store-application")[0], { trim: true });

            if (!app.util.validateInputs(registrationData, app.validationRules.registerStore))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/store-application", registrationData, function (err) {
                if (err) return;

                $("#form-store-application").addClass("hidden-other");
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



        // ----------- Buttons -----------

        // login goto register
        $("#login-goto-register").on("click", function () {
            self.showForm("#form-register", true, true, "Register", "register");
        });


        // login goto store login
        $("#login-goto-store-login").on("click", function () {
            self.showForm("#form-store-login", true, false, "Store-login", "store-login");
        });


        // store login goto login
        $("#store-login-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // login goto store application
        $("#login-goto-store-application").on("click", function () {
            self.showForm("#form-store-application", true, true, "Store Application", "store-application");
        });


        // login goto forgot password
        $("#login-forgot-password").on("click", function () {
            self.showForm("#form-forgot-password");
        });


        // register goto login
        $("#register-goto-login").on("click", function () {
            $("#checkbox-tnc").prop("checked", false);
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // store application goto login
        $("#store-application-goto-login").on("click", function () {
            $("#checkbox-tnc-store").prop("checked", false);
            self.showForm("#form-login", true, true, "Login", "login");
        });


        // forgot password goto login
        $("#forgot-password-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, "Register", "register");
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



        $(window).on("resize", function () {
            self.updateFormVisuals();
        });


        setTimeout(function () {
            self.updateFormVisuals();

            if (routeData.route == "/login") self.showForm("#form-login");
            if (routeData.route == "/store-login") self.showForm("#form-store-login");
            if (routeData.route == "/register") self.showForm("#form-register");
            if (routeData.route == "/store-application") self.showForm("#form-store-application");
        }, 300);

    },


    // Show a form
    showForm: function (formId, updateState, navbarActive, title, pushStateUrl) {
        $("#page-login .form-container-outer").addClass("hidden");
        var formContainer = $(formId).closest(".form-container-outer");
        formContainer.removeClass("hidden");

        if (updateState) {
            if (navbarActive) {
                $("#navbar-login").addClass("active");
            } else {
                $("#navbar-login").removeClass("active");
            }

            document.title = title;
            window.history.pushState(null, pushStateUrl, pushStateUrl);

            console.log(formContainer.offset().top)
            $("html, body").animate({ "scrollTop": 100 }, 200);
        }
    },


    // Update the form sizes and stuff
    updateFormVisuals: function () {
        $("#page-login form").each(function (index, el) {
            var height = el.clientHeight;
            var width = el.clientWidth;
            var container = $(el).closest(".form-container-outer");
            var siblings = $(el).siblings(".form-container-inner");

            $(container).css({ "height": height, "width": width });
            $(siblings[0]).css({ "height": height - 10, "width": width - 10 });
            $(siblings[1]).css({ "height": height - 10, "width": width - 10 });
        });
    },





}

