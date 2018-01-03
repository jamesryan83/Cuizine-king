"use strict";

var app = app || {};
app.dialogs = app.dialogs || {};


// Add to order dialog
app.dialogs.addToOrder = {

    dialogEl: "#dialog-store-add-to-order",
    dialogCloseEl: "#dialog-store-add-to-order-close",

    init: function (text) {
        var self = this;

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