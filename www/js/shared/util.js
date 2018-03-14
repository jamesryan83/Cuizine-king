
if (typeof app === "undefined") {
    var app = {};
    app.Strings = app.Strings = {};
}


app.util = {




    // ---------------------- Validation ----------------------


    checkIfObject: function (value) {
        if (!value) return false;

        return (value && typeof value === 'object' && value.constructor === Object);
    },


    checkIfString: function (value) {
        return (typeof value === "string" || value instanceof String);
    },


    checkIfDate: function (value) {
        if (!value) return false;

        return (value instanceof Date && isFinite(value));
    },


    checkIfPositiveInteger: function (value, includeZero) {
        var intValue = parseInt(value);
        if (isNaN(intValue)) return false;

        intValue = Number(value);
        if (!Number.isInteger(intValue)) return false;

        return includeZero ? intValue >= 0 : intValue > 0;
    },


    // Validates an inputs object and shows toast if there's an error
    validateInputs: function (inputs, validationRule) {
        if (!inputs || !this.checkIfObject(inputs) || Object.keys(inputs).length === 0) {
            console.log("validation inputs missing");
            return false;
        }

        if (!validationRule) {
            console.log("validate rule undefined");
            return false;
        }

        var errors = validate(inputs, validationRule, { format: "flat" });
        if (errors && errors.length > 0) {
            this.showToast(errors[0]); // TODO : move out of this file, affects tests
            return false;
        }

        return true;
    },



    // ---------------------- Stuff ----------------------


    days: function () {
        return [app.Strings.daysMon, app.Strings.daysTue, app.Strings.daysWed,
          app.Strings.daysThu, app.Strings.daysFri, app.Strings.daysSat,
          app.Strings.daysSun];
    },


    // Returns the index number of today from 0 to 6 where 0 is Monday
    getTodayIndex: function (date) {
        var d = date ? date.getDay() : new Date().getDay();
        d = d - 1;
        if (d == -1) d = 6;
        return d;
    },


    // Returns todays name (eg. WED)
    getTodayName: function (date) {
        return this.days()[this.getTodayIndex(date)];
    },


    // Returns tomorrows name (eg. WED)
    getTomorrowName: function (date) {
        var d = this.getTodayIndex(date) + 1;
        if (d > 6) d = 0;

        return this.days()[d];
    },


    // TODO : i18n
    // First letter of each word in a string to uppercase
    // https://stackoverflow.com/a/4878800
    toTitleCase: function(str) {
        if (!str) return "";

        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },




    // jquery-template formatters
    setupTemplateFormatters: function () {
        $.addTemplateFormatter({
            lowestOptionPriceFormatter: function (value) {
                return app.Strings.fromDollar + value;
            },
            priceFormatter: function (value) {
                return app.Strings.dollar + value.toFixed(2);
            },
            priceFromFormatter: function (value) {
                return app.Strings.fromDollar + value.toFixed(2);
            },
            categoryArrayFormatter: function(value) {
                return value.join(", ");
            },
            phoneNumberFormatter: function(value) {
                return app.Strings.phone + " " + value;
            },
            deliveryFormatter: function(value) {
                return app.Strings.delivery + " " + value;
            },
            minOrderFormatter: function(value) {
                return app.Strings.minOrder + " " + value;
            },
        });
    },



    // TODO : this being used ?
    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
    },



    // Show toast
    showToast: function (message, timeout, cssClass) {
        var $toasts = $("#toasts");
        var $toast = $("<p class='" + (cssClass || "") + "'>" + message + "</p>");

        // remove toasts if there's too many stacked up
        if ($toasts.children().length >= 5) {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });
        }

        // append toasts message and show toasts
        $toasts.append($toast[0]);
        $toasts.show();

        $toast.animate({ opacity: 1, bottom: 0 }, 100);

        // hide toast after a little bit
        setTimeout(function () {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });

            // hide container if it's empty
            if ($toasts.children().length === 0) {
                $toasts.hide().empty();
            }
        }, timeout || 2000);
    },


    // Show loading screen
    showLoadingScreen: function () {
        $("#loading-screen").show();
    },


    // Hide loading screen
    hideLoadingScreen: function () {
        $("#loading-screen").hide();
    },


    // Load a jquery-template template and return it
    loadTemplate: function (templateEl, data, itemId, idName) {
        var $item = $("<div></div>")
            .loadTemplate($(templateEl), data, { isFile: false });

        $item = $item.children().first().unwrap();

        if (idName) {
            $item.attr(idName, itemId);
        }

        return $item;
    },







    // ---------------------- Ajax ----------------------

    // TODO : check what happens on length error
    // check if jwt from local storage is valid
    checkToken: function (callback) {
        var self = this;
        var jwt = app.data.getJwtFromStorage();

//        if (jwt && jwt.length > 30) { // TODO : add a regex check or something
        if (!app.util.validateInputs(jwt, app.validationRules._people_jwt)) {
            app.data.invalidateTokensAndGoToLogin();
            return callback(app.Strings.invalidToken);
        }

        this.ajaxRequest({
            method: "POST", url: "/api/v1/check-token", auth: true
        }, function (err, result) {
            if (err) {
                console.log(err);
                self.invalidateCredentials();
                return callback(app.Strings.invalidToken);
            }

            app.data.addJwtToStorage(result.data.jwt);
            app.data.addPersonIdToStorage(result.data.id_person);
            if (result.data.id_store && result.data.id_store > 0) {
                app.data.addStoreIdToStorage(result.data.id_store);
            }

            return callback(null);
        });
    },


    // Preload images so they don't pop in when loading
    preloadImages: function (folderPath, arrayOfImagePaths) {
        var images = [];
        var counter = 0;

        // this creates a new image for each path and sets the src
        // when they'r all loaded the images [] is set to null
        for (var i = 0; i < arrayOfImagePaths.length; i++) {
            images.push(new Image());
            images[i].src = folderPath + arrayOfImagePaths[i];
            images[i].onload = function () {
                counter++;
                if (counter === images.length) images = null;
            }
        }
    },


    // Upload an image
    uploadImage: function (files, callback) {
        if (files && files.length > 0) {
            var file = files[0];
            if (file.size > 250000) {
                this.showToast(app.Strings.imageFileTooBig);
                return;
            }

            var formdata = new FormData();
            formdata.append("logo", files[0]);
            formdata.append("id_store", app.data.getStoreIdFromStorage());

            this.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-logo", auth: true,
                isImage: true, data: formdata
            }, function (err, result) {
                if (err || !result || !result.data || !result.data.url) {
                    console.log(err)
                    return callback(app.Strings.errorUploadingImage);
                }

                return callback(null, result.data.url);
            });


//            var imgEl = document.getElementById(imageEl);
//            var file = files[0];
//            console.log(imgEl, file)
//            var reader = new FileReader();
//            reader.onload = function (e) {
//                imgEl.src = e.target.result;
//            };
//            reader.readAsDataURL(file);
        } else {
            this.showToast(app.Strings.invalidImage);
        }
    },


    // TODO : check jwt before ajax
    // Generic ajax request
    // options are { method, url, data, auth, datatype, cache }, returns (err, data)
    ajaxRequest: function (options, callback) {
        var self = this;

        var contentType = "application/x-www-form-urlencoded; charser=UTF-8";
        if (options.isImage) contentType = false;

        // setup options
        var ajaxOptions = {
            method: options.method,
            url: options.url,
            data: options.data,
            cache: options.cache || false,
            processData: !options.isImage,
            contentType: contentType,
            beforeSend: function(xhr) {
                if (options.auth) {
                    var jwt = app.data.getJwtFromStorage();

                    if (!app.util.validateInputs({ jwt: jwt }, app.validationRules.jwt)) {
                        xhr.abort();
                        app.data.invalidateTokensAndGoToLogin();
                        return callback(app.Strings.invalidToken);
                    }

                    xhr.setRequestHeader("authorization", "Bearer " + jwt);
                }
            },
            success: function (result) {
                return callback(null, result);
            },
            error: function (err) {
                console.log(err)
                if (err) {
                    if (err.responseJSON && err.responseJSON.err) {
                        self.showToast(err.responseJSON.err, 4000);
                    } else {
                        self.showToast(app.Strings.serverError, 4000);
                    }
                }

                return callback(err);
            }
        }

        // set datatype
        if (options.dataType) {
            ajaxOptions.dataType = options.dataType;
        }

        // send request
        $.ajax(ajaxOptions);
    },

};


if (typeof module !== "undefined" && this.module !== module) {
    var $ = { };
    var validate = require("validate.js");
    app.Strings = require("../../../i18n/strings").getClientStrings();
    exports = module.exports = app.util;
}