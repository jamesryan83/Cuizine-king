
// Login, register, store-login, store application etc
app.site.login = {


    init: function (routeData) {
        var self = this;



        // ----------- Forms -----------

        // Submit login form
        $("#form-login").on("submit", function () {

            var data = validate.collectFormValues($("#form-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/login", data: data
            }, function (err, result) {
                if (err) return false;

                app.data.addJwtToStorage(result.data.jwt);
                app.data.addPersonIdToStorage(result.data.id_person);

                app.routerBase.loadPageForRoute("/account/" + result.data.id_person, "site");
            });

            return false;
        });



        // Submit store login form
        $("#form-store-login").on("submit", function () {
            var data = validate.collectFormValues($("#form-store-login")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.login))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-login", data: data
            }, function (err, result) {
                if (err) return false;

                app.data.addJwtToStorage(result.data.jwt);
                app.data.addPersonIdToStorage(result.data.id_person);
                app.data.addStoreIdToStorage(result.data.id_store);

                // store is in a different section which requires page refresh
                window.location.href = "/store-admin/" + result.data.id_store  + "/dashboard";
            });

            return false;
        });



        // Submit register form
        $("#form-register").on("submit", function () {
            if (!$("#checkbox-tnc").is(":checked")) {
                app.util.showToast(app.Strings.agreeToTnC);
                return false;
            }

            var data = validate.collectFormValues($("#form-register")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.createUser))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/create-user", data: data
            }, function (err, result) {
                if (err) return;

                app.data.addJwtToStorage(result.data.jwt);
                app.data.addPersonIdToStorage(result.data.id_person);

                $("#registration-success-email").text(data.email);
                self.showForm("#registration-success");
            });

            return false;
        });


        // Submit store application form
        $("#form-store-application").on("submit", function () {
            var data = validate.collectFormValues($("#form-store-application")[0], { trim: true });

            if (!app.util.validateInputs(data, app.validationRules.storeApplication))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-application", data: data
            }, function (err) {
                if (err) return;

                $("#store-application-success-email").text(data.email);
                self.showForm("#store-application-success");
            });

            return false;
        });


        // Send forgot password email
        $("#form-forgot-password").on("submit", function () {
//            var email = validate.collectFormValues(this, { trim: true });
//
//            if (!app.util.validateInputs(email, app.validationRules.forgotPassword))
//                return false;
//
//            app.util.ajaxRequest({
//                method: "POST", url: "/api/v1/forgot-password", data: data
//            }, function (err, data) {
//                if (!err && data) {
//                    app.util.showToast(data.message, 4000);
//                }
//            });

            // TODO : fix
            app.util.showToast(app.Strings.notWorkingYet);

            return false;
        });


        // Registration success, go to acount page
        $("#registration-success-account").on("click", function () {
            var id_person = app.data.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.util.showToast(app.Strings.unableToGoToAccountPage);
            }
        });


        // Store application success, go to home page
        $("#store-application-success-home").on("click", function () {
            window.location.href = "/";
        });





        // ----------- Buttons -----------

        // login goto register
        $("#login-goto-register").on("click", function () {
            self.showForm("#form-register", true, true, app.Strings.register, "register");
        });


        // login goto store login
        $("#login-goto-store-login").on("click", function () {
            self.showForm("#form-store-login", true, false, app.Strings.storeLogin, "store-login");
        });


        // store login goto login
        $("#store-login-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, app.Strings.login, "login");
        });


        // login goto store application
        $("#login-goto-store-application").on("click", function () {
            self.showForm("#form-store-application", true, true, app.Strings.storeApplication, "store-application");
        });


        // login goto forgot password
        $("#login-forgot-password").on("click", function () {
            self.showForm("#form-forgot-password");
        });


        // register goto login
        $("#register-goto-login").on("click", function () {
            $("#checkbox-tnc").prop("checked", false);
            self.showForm("#form-login", true, true, app.Strings.login, "login");
        });


        // store application goto login
        $("#store-application-goto-login").on("click", function () {
            $("#checkbox-tnc-store").prop("checked", false);
            self.showForm("#form-login", true, true, app.Strings.login, "login");
        });


        // forgot password goto login
        $("#forgot-password-goto-login").on("click", function () {
            self.showForm("#form-login", true, true, app.Strings.register, "register");
        });


        $(window).on("resize", function () {
            self.updateFormVisuals();
        });


        setTimeout(function () {
            self.updateFormVisuals();

            // show form for route
            if (routeData.route == "/login") self.showForm("#form-login");
            if (routeData.route == "/store-login") self.showForm("#form-store-login");
            if (routeData.route == "/register") self.showForm("#form-register");
            if (routeData.route == "/store-application") self.showForm("#form-store-application");
        }, 500);

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
        }

        $("html, body").animate({ "scrollTop": 100 }, 200);
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

