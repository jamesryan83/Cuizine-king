
if (typeof app === "undefined") {
    var app = {};
}


app.data = {


    storeDataRequestNotAllowed: false,
    storeData: {},  // store data cache



    // ---------------------- Store Data ----------------------


    // Gets the store data and caches it for a little while
    getStoreData: function (id_store, callback) {
        if (typeof id_store === "function") {
            callback = id_store;
            id_store = null;
        }

        var self = this;

        // check if already running
        if (this.storeDataRequestNotAllowed) {
            return callback(this.storeData);
        }

        id_store = id_store || this.getStoreIdFromStorage();

        if (!app.util.validateInputs({ id_store: id_store }, app.validationRules.getStore))
            return false;


        // set timeout
        this.storeDataRequestNotAllowed = true;
        setTimeout(function () {
            self.storeDataRequestNotAllowed = false;
        }, 2000);


        // get data from server
        app.util.ajaxRequest({
            method: "GET", url: "/api/v1/store?id_store=" + id_store, cache: true
        }, function (err, result) {
            if (err) return;

            self.storeData = result.data; // cache storeData

            return callback(self.storeData);
        });
    },


    // TODO : i18n
    // Returns if dinein/delivery is open and text for next time open or closed
    // the parameters are for testing
    isStoreOpen: function (timeNow, dayNow, addDays) {
        if (!this.storeData || Object.keys(this.storeData).length === 0) return null;

        var result = { isDineinOpen: false, isDeliveryOpen: false };

        var d = new Date();
        var currentTime = timeNow || d.getHours() + ":" + d.getMinutes();
        var mCurrentTime = moment(currentTime, "HH:mm").add(addDays || 0, "days");


        // get business times
        var today = dayNow || app.util.getTodayName();
        var dineinOpenTime = this.storeData.hours["hours_" + today + "_dinein_open"];
        var dineinCloseTime = this.storeData.hours["hours_" + today + "_dinein_close"];
        var deliveryOpenTime = this.storeData.hours["hours_" + today + "_delivery_open"];
        var deliveryCloseTime = this.storeData.hours["hours_" + today + "_delivery_close"];


        // is dinein open
        if (dineinOpenTime !== "NULL" && dineinCloseTime !== "NULL") {
            var mDineInOpen = moment(dineinOpenTime, "HH:mm");
            var mDineInClose = moment(dineinCloseTime, "HH:mm");
            if (mDineInClose.isBefore(mDineInOpen)) mDineInClose.add(1, "days");

            if (dineinOpenTime === currentTime || mCurrentTime.isBetween(mDineInOpen, mDineInClose)) {
                result.isDineinOpen = true;
            }
        }


        // is delivery open
        if (deliveryOpenTime !== "NULL" && deliveryCloseTime !== "NULL") {
            var mDeliveryOpen = moment(deliveryOpenTime, "HH:mm");
            var mDeliveryClose = moment(deliveryCloseTime, "HH:mm");
            if (mDeliveryClose.isBefore(mDeliveryOpen)) mDeliveryClose.add(1, "days");

            if (deliveryOpenTime === currentTime || mCurrentTime.isBetween(mDeliveryOpen, mDeliveryClose)) {
                result.isDeliveryOpen = true;
            }
        }

        return result;
    },



    // TODO : finish
    // Returns text saying when the store opens or closes next
    getWhenStoreOpensOrClosesNext: function (timeNow, dayNow, addDays) {
        if (!this.storeData || Object.keys(this.storeData).length === 0) return null;

        var isOpen = this.isStoreOpen(timeNow, dayNow, addDays);

        if (isOpen.isDineinOpen && isOpen) {

        } else {

        }
    },



    // Returns the positions of the headings and menu items for the server
    getMenuPositions: function (items) {
        var idNext = null;
        var idPrevious = null;
        var last = items.length - 1;
        var positions = { headings: [], products: [] };


        for (var i = 0; i < items.length; i++) {
            idPrevious = i === 0 ? null : (items[i - 1].dataset.headingId || items[i - 1].dataset.productId);
            idNext = i === last ? null : (items[i + 1].dataset.headingId || items[i + 1].dataset.productId);

            // item is product
            if (items[i].dataset.productId) {
                positions.products.push({
                    productId: items[i].dataset.productId,
                    position_id_previous: idPrevious,
                    position_id_next: idNext
                });

            // item is heading
            } else if (items[i].dataset.headingId) {
                positions.headings.push({
                    headingId: items[i].dataset.headingId,
                    above_product_id: idNext
                });
            }
        }

        return positions;
    },



    // ---------------------- Checkout Data ----------------------


    // Returns checkout data or an empty checkout object
    getCheckoutData: function () {
        var data = window.sessionStorage.getItem("cod");

        try { data = JSON.parse(data); } catch (e) { }

        if (!data) data = [];

        return data;
    },


    // Sets the checkout data
    setCheckoutData: function (data) {
        window.sessionStorage.setItem("cod", JSON.stringify(data));
    },





    // ---------------------- Tokens ----------------------

    // Add token to storage
    addJwtToStorage: function (token) {
        localStorage.setItem("jwt", token);
    },


    // Returns token from storage
    getJwtFromStorage: function () {
        var item = localStorage.getItem("jwt");
        if (app.util.checkIfString(item)) {
            return item;
        }

        return null;
    },


    // Add person id to storage
    addPersonIdToStorage: function (id) {
        localStorage.setItem("pid", id);
    },


    // Returns person id from storage
    getPersonIdFromStorage: function () {
        var item = Number(localStorage.getItem("pid"));
        if (app.util.checkIfPositiveInteger(item)) {
            return item;
        }

        return null;
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        var item = Number(localStorage.getItem("sid"));
        if (app.util.checkIfPositiveInteger(item)) {
            return item;
        }

        return null;
    },


    // Replace current id and jwt with invalid ones
    invalidateTokensAndGoToLogin: function () {
        localStorage.removeItem("jwt");
        localStorage.removeItem("pid");
        localStorage.removeItem("sid");
        window.location.href = "/login";
    },

}


if (typeof module !== "undefined" && this.module !== module) {
    var localStorage = { getItem: function () { return 1; } };
    var moment = require("moment");
    app.util = require("./util");
    app.validationRules = require("./validation-rules");
    exports = module.exports = app.data;
}
