"use strict";

var app = app || {};
app.dialogs = app.dialogs || {};


// Description dialog
app.dialogs.description = {

    dialogEl: "#dialog-store-description",
    dialogHeading: "#dialog-store-description-heading",
    dialogText: "#dialog-store-description-text",
    dialogCloseEl: "#dialog-store-description-close",

    init: function (name, description) {
        var self = this;

        $(this.dialogHeading).text(name);
        $(this.dialogText).text(description);

        $(this.dialogCloseEl).off().on("click", function () {
            self.hide();
        });
    },

    show: function () {
        $("#dialog-container").show();
        $(this.dialogEl).show();
    },

    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}