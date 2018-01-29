

// Description dialog
app.dialogs.description = {


    init: function () {
        var self = this;

        $("#dialog-store-description-close").on("click", function () {
            self.hide();
        });
    },


    update: function (name, description) {
        $("#dialog-store-description-heading").text(name);
        $("#dialog-store-description-text").text(description);
    },


    show: function () {
        $("#dialog-container").show();
        $("#dialog-store-description").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}