
// Home page
app.site.home = {


    // Init
    init: function () {

        $("#download-app-logos > div").on("click", function () {
            app.util.showToast(app.Strings.notWorkingYet);
        });


        $("#scooter").animate({left: screen.width + 20 }, 2000, "linear");

    },

}