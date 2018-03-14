

// Business hours dialog
app.dialogs.businessHours = {

    init: function () {
        var self = this;

        this.$hoursLeft = $("#dialog-store-hours-left");
        this.$hoursRight = $("#dialog-store-hours-right");

        $("#dialog-store-hours-close").on("click", function () {
            self.hide();
        });
    },


    // update dialog content
    update: function (hours) {
        if (!hours) return;

        var days = app.util.days();
        var today = app.util.getTodayName();


        // add left hours
        var frag = document.createDocumentFragment();
        for (var i = 0; i < days.length; i++) {
            frag.appendChild($(this.getHoursRow(hours, days[i], true, today === days[i]))[0]);
        }
        this.$hoursLeft.append(frag);


        // add right hours
        frag = document.createDocumentFragment();
        for (var i = 0; i < days.length; i++) {
            frag.appendChild($(this.getHoursRow(hours, days[i], false, today === days[i]))[0]);
        }
        this.$hoursRight.append(frag);
    },


    // Returns a html row of hours for a single day
    getHoursRow: function (hours, day, isDineIn, isToday) {
        // TODO : i18n

        // create left and right property names
        var el = "hours_" + day.toLowerCase() + "_" + (isDineIn ? "dinein" : "delivery");
        var openEl = el + "_open";
        var closeEl = el + "_close";


        // create text
        var text = hours[openEl];
        if (text.toLowerCase() === "null") {
            text = "closed";
        } else {
            text = hours[openEl] + " to " + hours[closeEl];
        }

        // highlight today
        var todayClass = "";
        if (isToday) todayClass = "today";

        return "<li class='" + todayClass + "'><span>" + day.toUpperCase() + "</span> " + text + "</li>";
    },


    // show dialog
    show: function () {
        app.dialogs.show("#dialog-store-hours");
    },


    // hide dialog
    hide: function () {
        app.dialogs.hide();
    },

}