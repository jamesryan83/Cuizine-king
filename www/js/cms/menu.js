

// Menu page
app.cms.menu = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData);

        // Show Edit mode
        $(".cms-menu-return").on("click", function () {
            $("#store-content-editable").removeClass("edit-mode");
            $("#store-content-preview-container").hide();
            $("#store-content-edit-container").show();
            $(".upload-button").show();

            $("#preview-mode-border").hide();
            $(".cms-menu-preview").show();
            $(".cms-menu-return").hide();
            $(".cms-menu-save").show();
        });

        // Show Preview
        $(".cms-menu-preview").on("click", function () {
            $("#store-content-editable").addClass("edit-mode");
            $("#store-content-preview-container").show();
            $("#store-content-edit-container").hide();
            $(".upload-button").hide();

            $("#preview-mode-border").show();
            $(".cms-menu-preview").hide();
            $(".cms-menu-return").show();
            $("#cms-menu-edit").hide();
        });

        $(".menu-edit-control").on("blur", function (e) {
            console.log(this.innerText)
        });


        // Edit button
        $("#cms-menu-edit").on("click", function () {
//            $("#store-menu-edit-sidebar").animate({ right: 0 }, 200);

            var data = app.storeContent.getDataFromPage();
            console.log(data)
        });


        // Sidebar close
        $("#store-menu-edit-sidebar-close").on("click", function () {
            $("#store-menu-edit-sidebar").animate({ right: -340 }, 200);
        });


        // address suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data)
        });

    },

}