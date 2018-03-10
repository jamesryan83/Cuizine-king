"use strict";

var util = require("util");


exports = module.exports = {

    // locales
    locales: {
        en: require("./en"),
        zh: require("./zh"),
    },


    // localize text
    localizeText: function (output, locale) {
        if (!locale || !this.locales[locale]) locale = "en";

        for (var i = 0; i < Object.keys(this.locales[locale]).length; i++) {
            var placeholder = Object.keys(this.locales[locale])[i];
            var value = this.locales[locale][placeholder];
            var re = new RegExp(placeholder, "gi");
            output = output.replace(re, value);
        }

        return output;
    },


    // Returns the locale strings that are sent to the client
    getClientStrings: function (locale) {
        if (!locale || !this.locales[locale]) locale = "en";

        return this.locales[locale].client;
    },


    // Returns a string for a locale
    get: function (key, locale) {
        if (!locale || !this.locales[locale]) locale = "en";

        // check client and server strings for the key
        var result = this.locales[locale].server[key];
        if (!result) result = this.locales[locale].client[key];
//        if (!result) result = "Unknown string";
        if (!result) result = key;
        return result;
    },

};
