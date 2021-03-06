

// Verify Account page
app.site.verifyAccount = {

    init: function () {
        var self = this;


        // Get verification token
        this.verificationToken = window.location.search;
        if (!this.verificationToken || this.verificationToken.length < 30) {
            app.util.showToast(app.Strings.invalidVerificationToken, 4000);
            return;
        }

        this.verificationToken = this.verificationToken.substr(3, this.verificationToken.length);


        // Submit verify account form
        $("#form-verify-account").on("submit", function () {
            var data = validate.collectFormValues($("#form-verify-account")[0], { trim: true });

            data.verification_token = self.verificationToken;

            if (!app.util.validateInputs(data, app.validationRules.verifyAccount))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/verify-account", data: data
            }, function (err, result) {
                if (err) return;

                app.data.addJwtToStorage(result.data.jwt);
                app.data.addPersonIdToStorage(result.data.id_person);

                $("#form-verify-account").addClass("hidden");
                $("#verify-account-success").removeClass("hidden");
            }, true);

            return false;
        });


        $("#verify-account-success-account").on("click", function () {
            var id_person = app.data.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.data.invalidateTokensAndGoToLogin();
            }
        });


        $("#verify-account-success-home").on("click", function () {
            window.location.href = "/";
        });
    }
}

