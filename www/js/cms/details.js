

// Details page
app.cms.details = {

    init: function () {
        var self = this;

        app.storeContent.init();

        this.$storeInfo = $("#store-info");
        this.$storeInfoEdit = $("#store-info-edit");

        var lastScrollPosition = 0; // for scrolling back down after return to editing


        // address suburb typeahead
        this.typeahead = new app.controls.Typeahead(function (data, url) {
            if (data && url) {
                console.log(data);
            }
        });


        // Get the store details data
        app.storeContent.getStoreData(function (storeData) {
            self.setupPage(storeData);
        });


        // change typeahead label capitalization
        $("#typeahead-suburb > label").text("Suburb");


        // Show Edit mode
        $(".page-cms-details-return").on("click", function () {
            $(this).hide();
            $(".page-cms-details-preview").show();
            $("#preview-mode-border").hide();

            self.$storeInfo.hide();
            self.$storeInfoEdit.show();

            $("html, body").animate({ "scrollTop": lastScrollPosition }, 200);
        });


        // Show Preview
        $(".page-cms-details-preview").on("click", function () {
            lastScrollPosition = $("html").scrollTop();

            $(this).hide();
            $(".page-cms-details-return").show();
            $("#preview-mode-border").show();

            self.$storeInfoEdit.hide();
            self.$storeInfo.show();
        });


        // Logo file changed
        $(".fileupload").on("change", function (e) {
            if (e.target.files.length > 0) {

                $(".store-info-image-empty").hide();
                $(".store-info-image-loading").show();

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
        this.$storeInfoEdit.on("submit", function () {
            var data = validate.collectFormValues($("#store-info-edit")[0], { trim: true })


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
                app.util.showToast("SAVED", null, "success");
            });

            return false;
        });
    },


    // Add data to page
    setupPage: function (storeData) {
        if (storeData) {

            app.storeContent.addStoreDetailsDataToPage(storeData);

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