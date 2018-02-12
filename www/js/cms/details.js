

// Details page
app.cms.details = {

    init: function () {
        var self = this;


        this.$storeInfoEditAddress = $("#store-info-edit-address");


        // preview button
        $(".page-cms-details-preview").on("click", function () {
            $(this).hide();
            $(".page-cms-details-return").show();
            $(".page-cms-details-save").hide();

            $("#store-info-edit").hide();
            $("#store-info").show();
        });


        // return button
        $(".page-cms-details-return").on("click", function () {
            $(this).hide();
            $(".page-cms-details-preview").show();
            $(".page-cms-details-save").show();

            $("#store-info").hide();
            $("#store-info-edit").show();
        });


        // address suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data)
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

    },

}