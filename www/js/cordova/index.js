"use strict";

var app = app || {};


// Cordova
app.cordova = {

    touchStartTime: null,
    touchStartTimeout: null,


    // Init
    init: function () {
        console.log("Cordova Ready");

        // app events
        document.addEventListener("pause", this.onPause.bind(this), false);
        document.addEventListener("resume", this.onResume.bind(this), false);
        document.addEventListener("backbutton", this.onBack.bind(this), false);
        document.addEventListener("touchstart", this.touchStarted.bind(this), false);
        document.addEventListener("touchend", this.touchEnded.bind(this), false);
    },



    // On Pause
    onPause: function () {
        console.log("onPause Called");
    },


    // On Resume
    onResume: function () {
        // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html#android-quirks
        console.log("onResume Called");
    },


    // On Back
    onBack: function () {
        console.log("back")
        //app.router.back();
    },


    // Touch Start
    touchStarted: function (e) {
//        if ($(e.target).hasClass("longClickable")) {
//            app.touchStartTime = new Date().getTime();
//            app.touchStartTimeout = setTimeout(function () {
//                app.util.showToast($(e.target).attr("title"));
//            }, 800);
//        }
    },


    // Touch End
    touchEnded: function (e) {
//        var touchTime = new Date().getTime() - app.touchStartTime;
//        if (touchTime < 800) {
//            window.clearTimeout(app.touchStartTimeout);
//        }
    },


}




