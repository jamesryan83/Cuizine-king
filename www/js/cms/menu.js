

// Menu page
app.cms.menu = {

    init: function () {
        var self = this;

        var editMenuPopup = $("#popup-edit-menu-item");

        $("#main-menu-edit").on("click", function () {
            editMenuPopup.addClass("active")
        });

        $("#main-menu-edit-cancel").on("click", function () {
            editMenuPopup.removeClass("active");
        });

        $("#main-menu-edit-save").on("click", function () {
            editMenuPopup.removeClass("active");
        });
    },

}