
// Dialog container
app.dialogs.init = function () {

    // initialize available dialogs
    Object.keys(this).forEach(function (el) {
        if (app.dialogs[el].init) {
            app.dialogs[el].init();
        }
    });


    this.$dialogContainer = $("#dialog-container");
    this.$dialogs = this.$dialogContainer.children();


    this.$dialogContainer.on("click", function () {

    });
}


app.dialogs.show = function (dialogEl) {
    this.$dialogContainer.show();
    $(dialogEl).show();
}


app.dialogs.hide = function () {
    this.$dialogs.hide();
    this.$dialogContainer.hide();
}
