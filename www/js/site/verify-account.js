

// Verify Account
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

            data.token = self.verificationToken;

            if (!app.util.validateInputs(data, app.validationRules.verifyAccount))
                return false;

            app.util.ajaxRequest("POST", "/api/v1/verify-account", data, function (err, result) {
                if (err) return;

                if (!result.jwt) alert("jwt missing");

                // add token to storage for api calls later
                app.util.addJwtToStorage(result.jwt);

                window.location.href = "/";
            }, true);

            return false;
        });
    }
}
// ?t=7h5GAbJWWfGBrPtEXk2DeAIA2rYC49GB6n6xVCUwwGpo0emkE3