
if (typeof app === "undefined") {
    var app = {};
}


app.data = {


    storeDataRequestNotAllowed: false,
    storeData: {},  // store data cache



    // ---------------------- Store Data ----------------------


    // Gets the store data and caches it for a little while
    getStoreData: function (callback) {
        var self = this;

        // check if already running
        if (this.storeDataRequestNotAllowed) {
            return callback(this.storeData);
        }

        var id_store = this.getStoreIdFromStorage();

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

            result.data.hours = result.data.hours[0];
            self.storeData = result.data; // cache storeData

            return callback(self.storeData);
        });
    },



    isStoreOpen: function () {
        if (!this.storeData) return false;

        var result = { dineinOpen: false, deliveryOpen: false };

        var today = app.util.getTodayName().toLowerCase();

        var dineinOpen = this.storeData.hours["hours_" + today + "_dinein_open"];
        var dineinClose = this.storeData.hours["hours_" + today + "_dinein_close"];
        var deliveryOpen = this.storeData.hours["hours_" + today + "_delivery_open"];
        var deliveryClose = this.storeData.hours["hours_" + today + "_delivery_close"];

        if (dineinOpen.toLowerCase() === "null") return false;


    },


    getWhenStoreOpens: function () {

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
        var item = localStorage.getItem("pid");
        if (app.util.checkIfPositiveInteger(item)) {
            return Number(item);
        }

        return null;
    },


    // Add store id to storage
    addStoreIdToStorage: function (id) {
        localStorage.setItem("sid", id);
    },


    // Returns store id from storage
    getStoreIdFromStorage: function () {
        var item = localStorage.getItem("sid");
        if (app.util.checkIfPositiveInteger(item)) {
            return Number(item);
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
    exports = module.exports = app.data;
}
