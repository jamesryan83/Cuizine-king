"use strict";

// Result modifier



exports = module.exports = {


    // Stores - get store
    storesGetStore: function (data) {
        if (!data) return data;

        // Format address to a single string
        var address = data.address[0];
        address = address.street_address + " " +
            address.suburb + " " + address.postcode;
        data.addressString = address;


        // Lowest priced option
        for (var i = 0; i < data.products.length; i++) {
            var product = data.products[i];

            var lowestOptionPrice = product.options[0].price;
            for (var j = 0; j < product.options.length; j++) {
                if (product.options[j].price < lowestOptionPrice) {
                    lowestOptionPrice = product.options[j].price;
                }
            }
            product.lowestOptionPrice = lowestOptionPrice;
        }

        // hours
        data.hours = data.hours[0];
        delete data.hours.created;
        delete data.hours.updated;
        delete data.hours.updated_by;

        return data;
    },



}
