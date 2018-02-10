

// Menu page
app.cms.menu = {

    init: function (routeData) {
        var self = this;

        this.$storeInfoEditAddress = $("#store-info-edit-address");

        var storeId = app.util.getStoreIdFromStorage();


        // get store data
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/store?id_store=" + storeId, cache: true
        }, function (err, result) {
            if (err) return;

            app.storeContent.init(routeData, true);
            app.storeContent.addMenuDataToPage(result.data);
        })


        // Show Edit mode
        $(".cms-menu-return").on("click", function () {
            $("#store-info-inner").hide();
            $("#store-info-edit").show();

            $("#preview-mode-border").hide();
            $(".cms-menu-preview").show();
            $(".cms-menu-return").hide();
        });


        // Show Preview
        $(".cms-menu-preview").on("click", function () {
            $("#store-info-edit").hide();
            $("#store-info-inner").show();

            $("#preview-mode-border").show();
            $(".cms-menu-preview").hide();
            $(".cms-menu-return").show();
        });


        // content editable lose focus
        $(".store-editable-control").on("blur", function (e) {
            console.log(this.innerText);
        });


        // Edit button
        $("#cms-menu-edit").on("click", function () {
//            var data = app.storeContent.getDataFromPage();
//            console.log(data)
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {
                app.util.uploadImage(e.target.files, function (err, imgPath) {
                    if (err) {
                        app.util.showToast(err);
                        return;
                    }

                    $("#store-info-image").attr("src", imgPath);
                });
            }
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