"use strict";

var fs = require("fs");
var jwt = require("jsonwebtoken");
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

        this.$messages = $("#messages");
        this.$loadingScreen = $("#loading-screen");
        this.projectFolderPath = "C:/Code/projects/Menuthing/website/";
        this.sqlFolderPath = this.projectFolderPath + "sql/";
        this.gulpFolderPath = this.projectFolderPath + "gulp";
        this.fakeDataFolderPath = this.projectFolderPath + "fakedata/";


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


        $("#recreate-generated-files").on("click", function () {
            self.$loadingScreen.show();
            setTimeout(function () {
                self.recreateFiles();
                self.$loadingScreen.fadeOut();
            }, 500);
        });


        $("#create-jwt").on("click", function () {
            var email = $("#create-jwt-email").val();
            var jwtoken = jwt.sign({ sub: email, shortExp: config.jwtExpiryShort }, config.secret, { expiresIn: config.jwtExpiryLong });
            self.logMessage(jwtoken)
        });


        $("#clear-messages").on("click", function () {
            self.$messages.val("");
        });


        // create sql batch file buttons from the files in the sql folder
        var batchFiles = fs.readdirSync(this.sqlFolderPath);
        for (var i = 0; i < batchFiles.length; i++) {
            if (batchFiles[i].indexOf(".bat") !== -1) {
                var button = $("<button class='batch-file-button'>" + batchFiles[i] + "</button>");
                button.on("click", function () {
                    var buttonText = this.innerText;
                    self.$loadingScreen.show();
                    setTimeout(function () {
                        self.runBatchFile(self.sqlFolderPath, buttonText);
                        self.$loadingScreen.fadeOut();
                    }, 500);
                });
                $("#database-batch-files").append(button[0]);
            }
        }
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



}




