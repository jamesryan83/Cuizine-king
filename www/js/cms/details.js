

// Details page
app.cms.details = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData, true);

        this.$storeInfoEditAddress = $("#store-info-edit-address");


        // Get the store details data
        app.storeContent.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // Show Edit mode
        $(".page-cms-details-return").on("click", function () {
            $(this).hide();
            $(".page-cms-details-preview").show();
            $(".page-cms-details-save").show();

            $("#store-info").hide();
            $("#store-info-edit").show();
        });


        // Show Preview
        $(".page-cms-details-preview").on("click", function () {
            $(this).hide();
            $(".page-cms-details-return").show();
            $(".page-cms-details-save").hide();

            $("#store-info-edit").hide();
            $("#store-info").show();
        });


        // address suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data);
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                $(".store-info-image-empty").hide();
                $(".store-info-image-loading").show();

                // send image to server
                app.util.uploadImage(e.target.files, function (err, imgPath) {
                    $(".store-info-image-loading").hide();

                    if (err) {
                        app.util.showToast(err);
                        return;
                    }

                    // add base64 image to image element
                    var file = e.target.files[0];
                    var reader  = new FileReader();
                    reader.addEventListener("load", function () {
                        app.storeContent.$logo.each(function (index, el) {
                            el.src = reader.result;
                        });
                        $(".store-info-image-empty").hide();
                        $(".store-info-image-loading").hide();
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });
            }
        });

    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {
            app.storeContent.addStoreDetailsDataToPage(storeData);
        }
    },


}