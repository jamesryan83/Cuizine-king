

// Menu page
app.cms.menu = {

    init: function () {
        var self = this;

        // Show Edit mode
        $("#cms-menu-return").on("click", function () {
            $("#store-content-editable").removeClass("edit-mode");
            $("#store-content-preview-container").hide();
            $("#store-content-edit-container").show();
            $(".upload-button").show();

            $("#preview-mode-border").hide();
            $("#cms-menu-preview").show();
            $("#cms-menu-return").hide();
        });

        // Show Preview
        $("#cms-menu-preview").on("click", function () {
            $("#store-content-editable").addClass("edit-mode");
            $("#store-content-preview-container").show();
            $("#store-content-edit-container").hide();
            $(".upload-button").hide();

            $("#preview-mode-border").show();
            $("#cms-menu-preview").hide();
            $("#cms-menu-return").show();
        });

        $(".menu-edit-control").on("blur", function (e) {
            console.log(this.innerText)
        });
    },

}