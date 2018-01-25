
// User account page
app.site.account = {


    // Init
    init: function (routeData) {
        var self = this;

        app.util.checkToken(function (err) {
            if (err) {
                window.location.href = "/login";
            }

            self.afterInit();
        });

    },


    // After init
    afterInit: function () {

    },

}