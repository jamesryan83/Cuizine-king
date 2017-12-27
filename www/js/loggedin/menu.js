"use strict";

var app = app || {};
app.main = app.main || {};


// Menu page
app.main.menu = {



    init: function () {
        var self = this;

        var editMenuPopup = $("#popup-edit-menu-item");

        $("#main-menu-edit").on("click", function () {
            editMenuPopup.addClass("active")
        });

        $("#main-menu-edit-cancel").on("click", function () {
            editMenuPopup.removeClass("active");
        });

        $("#main-menu-edit-save").on("click", function () {
            editMenuPopup.removeClass("active");
        });
    },

}