

// Details page
app.cms.details = {

    init: function (routeData) {
        var self = this;

        app.storeContent.init(routeData, true);


        this.$saveDetailsForm = $("#store-edit-details-form");


        // Get the store details data
        app.storeContent.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // address suburb typeahead
        new app.controls.Typeahead(function (data) {
            if (data) {
                console.log(data);
            }
        });


        // change typeahead label capitalization
        $("#typeahead-suburb > label").text("Suburb");


        // Show Edit mode
        $(".page-cms-details-return").on("click", function () {
            $(this).hide();
            $(".page-cms-details-preview").show();

            $("#store-info").hide();
            $("#store-info-edit").show();
        });


        // Show Preview
        $(".page-cms-details-preview").on("click", function () {
            $(this).hide();
            $(".page-cms-details-return").show();

            $("#store-info-edit").hide();
            $("#store-info").show();
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                $(".store-info-image-empty").hide();
                $(".store-info-image-loading").show();

                // send image to server
                app.util.uploadImage(e.target.files, function (err, imgPath) {
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

                    reader.addEventListener("error", function () {
                        $(".store-info-image-empty").hide();
                        $(".store-info-image-loading").hide();
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });
            }
        });


        // Save store details form
        this.$saveDetailsForm.on("submit", function () {
            return false;
        });

    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {
            console.log(storeData)

            app.storeContent.addStoreDetailsDataToPage(storeData);

            var address = storeData.address[0];

            this.$saveDetailsForm[0][0].value = storeData.description;
            this.$saveDetailsForm[0][1].value = address.street_address;
            this.$saveDetailsForm[0][2].value = address.postcode + " - " + address.suburb;
            this.$saveDetailsForm[0][3].value = storeData.phone_number;
            this.$saveDetailsForm[0][4].value = storeData.email;
        }
    },


}