"use strict";

var createAccounts = require("./create-user-accounts");

createAccounts.emptyDatabase("actual");

createAccounts.createStoreUsersAndStores(function (err) {
    if (err) return console.log(err);

    console.log("done");
});
