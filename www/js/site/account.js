
// User account page
app.site.account = {


    // Init
    init: function () {
        var self = this;

        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/account", auth: true
        }, function (err, result) {
            if (err) {
                app.data.invalidateTokensAndGoToLogin();
                return;
            }

            console.log(result);

            self.afterInit();
        });
    },


    // After init
    afterInit: function () {
        $(".page-content").show();


        // Delete account button
        $("#delete-account").on("click", function () {
            app.util.showLoadingScreen();

            app.util.ajaxRequest({
                method: "GET", url: "/api/v1/delete-user", auth: true
            }, function (err) {
                app.util.hideLoadingScreen();
                if (err) return;

                app.data.invalidateTokensAndGoToLogin();
            });
        });

    },

}