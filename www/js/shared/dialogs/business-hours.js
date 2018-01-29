

// Business hours dialog
app.dialogs.businessHours = {

    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],


    init: function (storeHours) {
        var self = this;

        $("#dialog-store-hours-close").on("click", function () {
            self.hide();
        });
    },


    update: function (hours, hoursEl) {
        this.addHoursToList(storeHours.slice(0, 7), "#dialog-store-hours-left");
        this.addHoursToList(storeHours.slice(7, 14), "#dialog-store-hours-right");

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
        $("#dialog-store-hours").show();
    },


    hide: function () {
        $("#dialog-container").hide();
        $("#dialog-container > div").hide();
    },

}