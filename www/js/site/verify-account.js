

// Verify Account page
app.site.verifyAccount = {

    init: function () {
        var self = this;

        this.verificationToken = window.location.search;
        if (!this.verificationToken || this.verificationToken.length < 30) {
            app.util.showToast("Invalid verification token", 4000);
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

                if (!result.data.jwt) alert("jwt missing");

                app.util.addJwtToStorage(result.data.jwt);
                app.util.addPersonIdToStorage(result.data.id_person);

                $("#form-verify-account").addClass("hidden");
                $("#verify-account-success").removeClass("hidden");
            }, true);

            return false;
        });


        $("#verify-account-success-account").on("click", function () {
            var id_person = app.util.getPersonIdFromStorage();

            if (id_person) {
                window.location.href = "/account/" + id_person;
            } else {
                app.util.showToast("Error : Unable to go to account page");
            }
        });


        $("#verify-account-success-home").on("click", function () {
            window.location.href = "/";
        });
    }
}

