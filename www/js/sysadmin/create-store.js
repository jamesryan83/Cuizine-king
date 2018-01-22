

// Sysadmin
app.sysadmin.createStore = {


    init: function (routeData) {
        var self = this;

        this.businessHoursArray = this.generateBusinessHours();


        // load tabcontrol
        new app.controls.TabControl("#page-sysadmin-tabcontrol", function (tab) { });


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {
            console.log(data)
        });


        // generate a random password
        $("input[name='password']").val(this.generatePassword());


        // add business hour select elements
        $("#business-hours-container select").each(function (index, el) {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < self.businessHoursArray.length; i++) {
                frag.appendChild($("<option>" + self.businessHoursArray[i] + "</option>")[0]);
            }

            $(el).append(frag);
            $(el)[0].size = "10";
        });

        $("#fileupload").on("change", function (e) {
            if (e.target && e.target.files && e.target.files.length > 0) {
                console.log(e.target.files[0])
            }
        });

        $("#form-create-store").on("submit", function (e) {
            var data = validate.collectFormValues($("#form-create-store")[0], { trim: true });
console.log(data)
//            if (!app.util.validateInputs(data, app.validationRules.createStore))
//                return false;

            return false;
        })


//        // file upload button
//        $("#fileupload").fileupload({
//            maxNumberOfFiles: 1,
//            acceptFileTypes: /^image\/(jpe?g|png)$/i,
//            paramName: "logo",
//            maxFileSize: 250000,
//            formData: {  },
//            url: "/api/v1/upload-logo",
//
//            add: function (e, data) {
//                // validate selected file
//
//                console.log(data)
//
////                var $this = $(this);
////                var validation = data.process(function () {
////                    if (data.files.length < 1) return false;
////                    if (data.files[0].size > 250000) return false;
////
////                    return $this.fileupload('process', data.files);
////                });
////
////                validation.done(function() {
////                    data.submit(); // ok
////                });
////
////                validation.fail(function(data) {
////                    app.util.showToast("Error - " + data.files[0].error);
////                    return;
////                });
//            },
//
//            beforeSend: function() {
//                $("#store-logo-loading").show();
//            },
//
//            done: function (e, data) {
//                self.afterImageUploaded(data);
//            },
//
//            fail: function(e, data) {
//                $("#store-logo-loading").hide();
//                app.util.showToast("Unknown server error");
//            }
//        });

    },


//    // After an image is uploaded
//    afterImageUploaded: function (data) {
//
//        // load image into background of div
//        var fr = new FileReader();
//        fr.onload = function () {
//            $("#store-logo").css({
//                "background-image": "url(" + fr.result + ")"
//            });
//
//            $("#store-logo-loading").hide();
//        }
//        fr.readAsDataURL(data.files[0]);
//    },


    // Generates a random string for the users first password
    generatePassword: function () {
        return Math.random().toString(36).substr(2, 8);
    },


    // Generates the business hours for the select elements
    generateBusinessHours: function () {
        var currentHour = "";
        var currentMin = "";
        var output = [];

        for (var i = 0; i < 24; i++) {
            currentHour = i < 10 ? "0" + i : i.toString();

            for (var j = 0; j < 4; j++) {
                switch (j) {
                    case 0: currentMin = ":00"; break;
                    case 1: currentMin = ":15"; break;
                    case 2: currentMin = ":30"; break;
                    case 3: currentMin = ":45"; break;
                }

                output.push(currentHour + currentMin);
            }
        }

        return output;
    },

}