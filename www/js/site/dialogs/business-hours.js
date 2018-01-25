

// Business hours dialog
app.dialogs.businessHours = {

    dialogEl: "#dialog-store-hours",
    hoursLeftEl: "#dialog-store-hours-left",
    hoursRightEl: "#dialog-store-hours-right",
    dialogCloseEl: "#dialog-store-hours-close",

    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],

    init: function (storeHours) {
        var self = this;


        this.addHoursToList(storeHours.slice(0, 7), this.hoursLeftEl);
        this.addHoursToList(storeHours.slice(7, 14), this.hoursRightEl);

        $(this.dialogCloseEl).off().on("click", function () {
            self.hide();
        });
    },

    addHoursToList: function (hours, hoursEl) {
        var text = "";
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 7; i++) {
            if (hours[i].opens === "c") {
                text = "closed";
            } else {
                text = hours[i].opens + " to " + hours[i].closes;
            }

            frag.append($("<li><span>" + this.days[i] + "</span> " + text + "</li>")[0]);
        }
        $(hoursEl).empty().append(frag);
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