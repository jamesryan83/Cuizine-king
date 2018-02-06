"use strict";

var fs = require("fs");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var execSync = require("child_process").execSync;

var config = require("../server/config");

var app = app || {};


$(document).ready(function () {
    app.main.init();
});


app.main = {


    projectFolder: "",


    // Initialize
    init: function () {
        var self = this;

        this.host = "http://localhost:1337/";

        this.$messages = $("#messages");
        this.$loadingScreen = $("#loading-screen");
        this.projectFolderPath = "C:/Code/projects/Menuthing/website/";
        this.sqlFolderPath = this.projectFolderPath + "sql/";
        this.gulpFolderPath = this.projectFolderPath + "gulp";
        this.fakeDataFolderPath = this.projectFolderPath + "fakedata/";


        // suburb typeahead
        new app.controls.Typeahead("#suburb-search", "#suburb-search-list", this.suburbs, function (data) {

        }, this.host + "api/v1/location?q=");


        // delete files button
        $("#delete-generated-files").on("click", function () {
            self.$loadingScreen.show();
            setTimeout(function () {
                self.deleteAllFilesInFolder(self.projectFolderPath + "server/procedures/");
                self.deleteAllFilesInFolder(self.projectFolderPath + "sql/generated/");
                self.deleteAllFilesInFolder(self.projectFolderPath + "sql/generated/seed/");
                self.deleteAllFilesInFolder(self.projectFolderPath + "www/generated/");
                self.$loadingScreen.fadeOut();
            }, 500);
        });


        // recreate generated files
        $("#recreate-generated-files").on("click", function () {
            self.$loadingScreen.show();
            setTimeout(function () {
                self.recreateFiles();
                self.$loadingScreen.fadeOut();
            }, 500);
        });


        // create a jwt
        $("#create-jwt").on("click", function () {
            var id_person = $("#create-jwt-id-person").val();
            var shortExp = $("#create-jwt-short-exp").val();
            var longExp = $("#create-jwt-long-exp").val();
            var jwtoken = jwt.sign({ sub: id_person, shortExp: shortExp }, config.secret, { expiresIn: longExp });
            self.logMessage(jwtoken)
        });


        // encrypt a password
        $("#encrypt-password").on("click", function () {
            var password = $("#encrypt-password-input").val();
            self.logMessage(bcrypt.hashSync(password, 10))
        });


        // Create other token
        $("#create-other-token").on("click", function () {
            self.logMessage(self.makeid());
        });


        // clear messages
        $("#clear-messages").on("click", function () {
            self.$messages.val("");
        });


        // create sql batch file buttons from the files in the sql folder
        var batchFiles = fs.readdirSync(this.sqlFolderPath + "/batchfiles/");
        for (var i = 0; i < batchFiles.length; i++) {
            if (batchFiles[i].indexOf(".bat") !== -1) {
                var button = $("<button class='batch-file-button button-3'>" + batchFiles[i] + "</button>");
                button.on("click", function () {
                    var buttonText = this.innerText;
                    self.$loadingScreen.show();
                    setTimeout(function () {
                        self.runBatchFile(self.sqlFolderPath + "/batchfiles/", buttonText);
                        self.$loadingScreen.fadeOut();
                    }, 500);
                });
                $("#database-batch-files").append(button[0]);
            }
        }


        // add headings to sidebar
        $("h3").each(function (index, el) {
            $("#sidebar").append($("<a href='#" + el.id + "'>" + el.innerText + "</a>"))
        });


        // hide/show messages
        $("#hide-show-messages").on("click", function () {
            $("#page-container").toggleClass("hide-messages");
        });



        // Create store form
        $("#form-create-store").on("submit", function () {
            var data = validate.collectFormValues(this, { trim: true });

            var temp = data.postcode.split(" - ");
            data.suburb = temp[1];
            data.postcode = temp[0];

            data.jwt = jwt.sign({ sub: data.email, shortExp: config.jwtExpiryShort }, config.secret, { expiresIn: config.jwtExpiryLong });
            data.password = bcrypt.hashSync(data.password, 10);

            if (!app.util.validateInputs(data, app.validationRules.createStore))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: self.host + "api/sysadmin/create-store", auth: true, data : data },
            function (err, result) {
                if (err) return;

                app.util.showToast("Store created.  id_store = " + result.data.id_store, 4000);
            })

            return false;
        });


        $("#form-delete-store").on("submit", function () {
            var data = validate.collectFormValues(this, { trim: true });

            data.jwt = jwt.sign({ sub: data.email, shortExp: config.jwtExpiryShort }, config.secret, { expiresIn: config.jwtExpiryLong });

            if (!app.util.validateInputs(data, app.validationRules.deleteStore))
                return false;

            app.util.ajaxRequest({
                method: "POST", url: self.host + "api/sysadmin/delete-store", auth: true, data: data },
            function (err, result) {
                if (err) return;

                app.util.showToast("Store deleted.  id_store = " + data.id_store, 4000);
            });

            return false;
        });

    },


    // Deletes all files in a folder
    deleteAllFilesInFolder: function (folder) {
        var files = fs.readdirSync(folder);
        for (var i = 0; i < files.length; i++) {
            if (fs.statSync(folder + files[i]).isFile()) {
                fs.unlinkSync(folder + files[i]);

                this.logMessage("Deleted: " + folder + files[i]);
            }
        }

        this.logMessage("Finished: " + folder);
    },


    // Execute a batch file
    runBatchFile: function (batchFileCwd, batchFileName) {
        this.logMessage("Running: " + batchFileCwd + batchFileName);

        try {
            var result = execSync(batchFileName, { cwd: batchFileCwd, encoding: "utf-8" });
            this.logMessage(result);
        } catch (ex) {
            this.logMessage(ex.message);
        }
    },


    // Recreate all generated files
    recreateFiles: function () {
        this.runBatchFile(this.gulpFolderPath, "gulp-all.bat");

        try {
            this.logMessage("Starting Excel to Sql");
            var result = execSync(this.fakeDataFolderPath + "Fakedata-run.vbs");
            this.logMessage("Completed Excel to Sql");
        } catch (ex) {
            this.logMessage("Excel to Sql error...");
            this.logMessage(ex.message);
        }
    },


    // Adds text to messages output
    logMessage: function (message) {
        this.$messages.val(this.$messages.val() + message + "\n");
        this.$messages.scrollTop(this.$messages[0].scrollHeight);
    },



    // TODO : call function that's used in website code, should be the same as this anyway
    // Create a random alphanumeric string
    // https://stackoverflow.com/a/1349426
    makeid: function () {
        var tokenLength = 64;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < tokenLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },

}




