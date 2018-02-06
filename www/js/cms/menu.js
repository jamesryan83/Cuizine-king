

// Menu page
app.cms.menu = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData);

        this.$storeInfoEditAddress = $("#store-info-edit-address");


        // Show Edit mode
        $(".cms-menu-return").on("click", function () {
            $("#store-content-editable").removeClass("edit-mode");
            $("#store-content-preview-container").hide();
            $("#store-content-edit-container").show();
            $(".store-editmode-control").show();

            $("#preview-mode-border").hide();
            $(".cms-menu-preview").show();
            $(".cms-menu-return").hide();
        });


        // Show Preview
        $(".cms-menu-preview").on("click", function () {
            $("#store-content-editable").addClass("edit-mode");
            $("#store-content-preview-container").show();
            $("#store-content-edit-container").hide();
            $(".store-editmode-control").hide();

            $("#store-info-edit-address").removeClass("active");

            $("#preview-mode-border").show();
            $(".cms-menu-preview").hide();
            $(".cms-menu-return").show();
        });


        // content editable lose focus
        $(".store-editable-control").on("blur", function (e) {
            console.log(this.innerText)
        });


        // Edit button
        $("#cms-menu-edit").on("click", function () {
//            var data = app.storeContent.getDataFromPage();
//            console.log(data)
        });




        // Logo file changed
        $(".fileupload").on("change", function (e) {
            app.util.uploadImage(e.target.files);
        });




        // address save
        $("#store-info-edit-address-save").on("click", function () {
            self.$storeInfoEditAddress.removeClass("active");
        });


        // address cancel
        $("#store-info-edit-address-cancel").on("click", function () {
            self.$storeInfoEditAddress.removeClass("active");
        });


        // address show/hide
        $("#store-info-address-edit").on("click", function () {
            self.$storeInfoEditAddress.toggleClass("active");
        });


        // address suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data)
        });

    },

}