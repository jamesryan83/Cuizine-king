

// Details page
app.cms.details = {

    init: function () {
        var self = this;

        this.storeId = app.util.getStoreIdFromStorage();

        this.$logo = $(".store-info-image");
        this.$storeInfoEditAddress = $("#store-info-edit-address");


        // logo
        var logo = new Image();
        logo.src = "/res/storelogos/store" + this.storeId + ".jpg";
        logo.onload = function () {
            self.$logo.attr("src", logo.src);
        }
        logo.onerror = function () {

        }


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
            console.log(data);
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {
                app.util.uploadImage(e.target.files, function (err, imgPath) {
                    if (err) {
                        app.util.showToast(err);
                        return;
                    }

                    self.$logo.attr("src", imgPath);
                });
            }
        });

    },

}