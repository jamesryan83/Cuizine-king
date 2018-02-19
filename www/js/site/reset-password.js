
// Reset password page
app.site.resetPassword = {

    init: function () {
        var self = this;


        // get reset password token
        this.resetPasswordToken = window.location.search;
        if (!this.resetPasswordToken || this.resetPasswordToken.length < 30) {
            app.util.showToast("Invalid verification token", 4000);
            return;
        }

        this.resetPasswordToken = this.resetPasswordToken.substr(3, this.resetPasswordToken.length);


        // Submit reset password form
        $("#form-reset-password").on("submit", function () {
            var data = validate.collectFormValues($("#form-reset-password")[0], { trim: true });

            data.token = self.resetPasswordToken;

            if (!app.util.validateInputs(data, app.validationRules.resetPassword))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/reset-password", data: data
            }, function (err) {
                if (err) return;

                app.util.invalidateCredentialsAndGoToLogin();
            }, true);

            return false;
        });
    }
}
