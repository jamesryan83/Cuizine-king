

// Details page
app.cms.details = {

    init: function () {
        var self = this;

        app.storeContent.init();

        this.$storeInfo = $("#store-info");
        this.$detailsForm = $("#store-info-edit");
        this.$storeInfoEdit = $("#store-info-edit");
        this.$previewBorder = $("#preview-mode-border");
        this.$returnButton = $(".page-cms-details-return");
        this.$previewButton = $(".page-cms-details-preview");


        // for scrolling back down after return to editing
        var lastScrollPosition = 0;


        // address suburb typeahead
        this.typeahead = new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                console.log(data);
            }
        });


        // Get the store details data
        app.data.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // change typeahead label capitalization
        $("#typeahead-suburb > label").text("Suburb");


        // Show Edit mode
        this.$returnButton.on("click", function () {
            $(this).hide();
            self.$previewButton.show();
            self.$previewBorder.hide();
            self.$returnButton.hide();

            self.$storeInfo.hide();
            self.$storeInfoEdit.show();

            $("html, body").animate({ "scrollTop": lastScrollPosition }, 200);
        });


        // Show Preview
        this.$previewButton.on("click", function () {
            lastScrollPosition = $("html").scrollTop();

            $(this).hide();
            self.$previewButton.hide();
            self.$returnButton.show();
            self.$previewBorder.show();

            self.$storeInfoEdit.hide();
            self.$storeInfo.show();
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                app.storeContent.$logoEmpty.hide();
                app.storeContent.$logoLoading.show();

                // send image to server
                app.util.uploadImage(e.target.files, function (err) {
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

                        app.storeContent.$logoEmpty.hide();
                        app.storeContent.$logoLoading.hide();
                    }, false);

                    reader.addEventListener("error", function () {
                        app.storeContent.$logoEmpty.hide();
                        app.storeContent.$logoLoading.hide();
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });
            }
        });


        // Save store details form
        this.$storeInfoEdit.on("submit", function () {
            var data = validate.collectFormValues(this.$detailsForm[0], { trim: true })


            // check hours
            var hoursErr = app.validationRules.validateHours(data);
            if (hoursErr) {
                app.util.showToast(hoursErr, 5000);
                return false;
            }


            // remove logo
            delete data.logo;


            // get postcode/suburb
            var postcodeSuburb = self.typeahead.getValue();
            data.suburb = postcodeSuburb.suburb;
            data.postcode = postcodeSuburb.postcode;

            if (!app.util.validateInputs(data, app.validationRules.updateStoreDetails))
                return false;

            // send data
            app.util.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-details", data: data, auth: true
            }, function (err, result) {
                if (err) return false;

                console.log(result);
                app.util.showToast(app.Strings.saved, null, "success");
            });

            return false;
        });
    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {

            app.storeContent.addStoreDetailsDataToPage(null, storeData, "cms");

            var address = storeData.address[0];

            this.$storeInfoEdit[0][1].value = storeData.description;
            this.$storeInfoEdit[0][2].value = address.street_address;
            this.typeahead.setValue(address.postcode, address.suburb);
            this.$storeInfoEdit[0][4].value = storeData.phone_number;
            this.$storeInfoEdit[0][5].value = storeData.email;

            // hours
            Object.keys(storeData.hours).forEach(function (key) {
                if (key.indexOf("hours_") === 0) {
                    $("[name='" + key + "']").val(
                        (storeData.hours[key] === "NULL") ? "" : storeData.hours[key]);
                }
            });
        }
    },


}