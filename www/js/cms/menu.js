

// Menu page
app.cms.menu = {

    init: function () {
        var self = this;

        $("#cms-menu-edit").on("click", function () {
            $("#store-content-preview-container").hide();
            $("#store-content-edit-container").show();
            $("#cms-menu-preview").removeClass("active");
            $("#cms-menu-edit").addClass("active");
            $("#edit-mode-border").show();
        });

        $("#cms-menu-preview").on("click", function () {
            $("#store-content-edit-container").hide();
            $("#store-content-preview-container").show();
            $("#cms-menu-preview").addClass("active");
            $("#cms-menu-edit").removeClass("active");
            $("#edit-mode-border").hide();
        });

    },

}