

app.util = {



    // ---------------------- Stuff ----------------------


    // Validates an inputs object and shows toast if there's an error
    validateInputs: function (inputs, validationRule) {
        var errors = validate(inputs, validationRule, { format: "flat" });
        if (errors && errors.length > 0) {
            this.showToast(errors[0]);
            return false;
        }

        return true;
    },


    // Returns true if running on cordova
    isCordova: function () {
        return $("#is-cordova").val() == "true";
    },


    // Show toast
    showToast: function (message, timeout) {
        var $toasts = $("#toasts");
        var toast = $("<p>" + message + "</p>");

        // remove toasts if there's too many stacked up
        if ($toasts.children().length >= 5) {
            $toasts.children().first().animate({ opacity: 0, bottom: -50 }, 100, function () {
                $(this).remove();
            });
        }

        // append toasts message and show toasts
        $toasts.append(toast[0]);
        $toasts.show();

        $(toast).animate({ opacity: 1, bottom: 0 }, 100);

        // hide toast after a little bit
        var currentToast = setTimeout(function () {
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


    // First letter of each word in a string to uppercase
    // https://stackoverflow.com/a/4878800
    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },






    // ---------------------- Credentials ----------------------

    // Add token to storage
    addJwtToStorage: function (token) {
        localStorage.setItem("jwt", token);
    },


    // Returns token from storage
    getJwtFromStorage: function () {
        return localStorage.getItem("jwt");
    },


    // Add person id to storage
    addPersonIdToStorage: function (id) {
        localStorage.setItem("pid", id);
    },


    // Returns person id from storage
    getPersonIdFromStorage: function () {
        return Number(localStorage.getItem("pid"));
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        return Number(localStorage.getItem("sid"));
    },


    // Replace current id and jwt with invalid ones
    invalidateCredentialsAndGoToLogin: function () {
        localStorage.removeItem("jwt");
        localStorage.removeItem("pid");
        localStorage.removeItem("sid");
        window.location.href = "/login";
    },



    // ---------------------- Ajax ----------------------


    // check if jwt from local storage is valid
    checkToken: function (callback) {
        var self = this;
        var jwt = this.getJwtFromStorage();

        if (jwt && jwt.length > 30) { // TODO : add a regex check or something

            this.ajaxRequest({
                method: "POST", url: "/api/v1/check-token", auth: true
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    self.invalidateCredentials();
                    return callback("invalid token");
                }

                self.addJwtToStorage(result.data.jwt);
                self.addPersonIdToStorage(result.data.id_person);
                if (result.data.id_store && result.data.id_store > 0) {
                    self.addStoreIdToStorage(result.data.id_store);
                }

                return callback(null);
            });
        } else {
            this.invalidateCredentials();
            return callback("invalid token");
        }
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
        var self = this;

        if (files && files.length > 0) {
            var file = files[0];
            if (file.size > 250000) {
                this.showToast("Image file size too big.  Must be < 250kB");
                return;
            }

            var formdata = new FormData();
            formdata.append("logo", files[0]);
            formdata.append("id_store", this.getStoreIdFromStorage());

            this.ajaxRequest({
                method: "POST", url: "/api/v1/store-update-logo", auth: true,
                isImage: true, data: formdata
            }, function (err, result) {
                if (err || !result || !result.data || !result.data.url) {
                    console.log(err)
                    return callback("Error uploading image");
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
            this.showToast("Invalid Image");
        }
    },



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
            beforeSend: function(request) {
                if (options.auth) {
                    request.setRequestHeader("authorization", "Bearer " + app.util.getJwtFromStorage());
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
                        self.showToast("Server Error", 4000);
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
