
// Dialog container
app.dialogs.init = function () {

    // initialize available dialogs
    Object.keys(this).forEach(function (el) {
        if (app.dialogs[el].init) {
            app.dialogs[el].init();
        }
    });


    this.$dialogContainer = $("#dialog-container");


    this.$dialogContainer.on("click", function () {

    });
}


app.dialogs.show = function (dialogEl) {
    this.$dialogContainer.show();
    $(dialogEl).show();
}


app.dialogs.hide = function () {
    this.$dialogContainer.children().hide();
    this.$dialogContainer.hide();
}

app.dialogs.addDialog = function (html) {
    this.$dialogContainer.append($(html));
}
