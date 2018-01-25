"use strict";

// Use this to create fake users in the database

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../server/config");
var database = require("../server/database/database");


exports = module.exports = {


    // admin users
    adminUsers: [{
        "id_person_type": config.dbConstants.personTypes.systemuser,
        "first_name": "james",
        "last_name": "ryan",
        "email": "james4165@hotmail.com",
        "password": "password",
        "is_verified": 1,
        "verification_token": "na",
        "id_store": "",
        "is_deleted": 0,
        "is_deleted_email": ""
    }],


    // store users
    storeUsers: [{
        "id_person_type": config.dbConstants.personTypes.storeuser,
        "first_name": "james",
        "last_name": "ryan",
        "email": "james4171@hotmail.com",
        "password": "password",
        "is_verified": 1,
        "verification_token": "na",
        "id_store": 1,
        "is_deleted": 0,
        "is_deleted_email": ""
    }],


    stores: [{
        "name": "Test Store 1"
    }],



    // passing nothing empties the test database
    emptyDatabase: function (db, recreate) {
        if (db === "actual") {
            if (recreate) {
                database.runBatchFileSync("create-empty-db");
            } else {
                database.runBatchFileSync("empty-db");
            }
        } else {
            if (recreate) {
                database.runBatchFileSync("create-test-db");
            } else {
                database.runBatchFileSync("empty-test-db");
            }
        }
    },


    // connect to db if not connected
    connectToDatabase: function (callback) {
        if (!database.isConnected) {
            console.log("connecting to db");
            database.connect(config.mssql);
            database.once("connected", function () {
                callback();
            });
        } else {
            callback();
        }
    },


    // Create admin users
    createAdminUsers: function (callback) {
        var self = this;

        this.connectToDatabase(function () {
            var insertCount = 0;
            self.addUsersToDatabase(insertCount, self.adminUsers, function (err) {
                database.close();
                return callback(err);
            });
        });
    },



    // Create stores and store users
    createStoreUsersAndStores: function (callback) {
        var self = this;

        this.connectToDatabase(function () {
            var insertCount = 0;
            self.addStoresToDatabase(insertCount, self.stores, function (err) {
                if (err) return callback(err);

                var insertCount2 = 0;
                self.addUsersToDatabase(insertCount2, self.storeUsers, function (err) {
                    database.close();
                    return callback(err);
                });
            });
        });
    },


    // Add a user to the database
    addUsersToDatabase: function (insertCount, inputsArray, callback) {

        // called when finished
        function finished(err) {
            if (err) {
                return callback(err);
            }

            if (insertCount < inputsArray.length - 1) {
                return this.addUsersToDatabase(insertCount, inputsArray, callback);
            }

            return callback();
        }

        var inputs = inputsArray[insertCount];

        // make jwt
        jwt.sign({ email: inputs.email }, config.secret, { expiresIn: "1y" }, function (err, jwToken) {
            if (err) return finished(err);

            // encrypt password
            bcrypt.hash(inputs.password, 10, function (err, encryptedPassword) {
                if (err) return finished(err);

                // insert into database
                var values = "(" +
                    inputs.id_person_type + "," +
                    "'" + inputs.first_name + "'," +
                    "'" + inputs.last_name + "'," +
                    "'" + inputs.email + "'," +
                    "'" + encryptedPassword + "'," +
                    "'" + jwToken + "'," +
                    "" + inputs.is_verified + "," +
                    "'" + inputs.verification_token + "'," +
                    "" + (inputs.id_store || "NULL") + "," +
                    "" + inputs.is_deleted + "," +
                    "'" + inputs.is_deleted_email + "'," +
                    1 + ")";

                var query = "INSERT INTO App.people " +
                    "(id_person_type, first_name, last_name, email, password, jwt, is_verified, verification_token, id_store, is_deleted, is_deleted_email, updated_by) VALUES " +
                    values;

                console.log("saving " + (inputs.id_store ? "store " : "") + "user " + inputs.email);
                database.executeQuery(query, function (err, result) {
                    if (err) finished(err);

                    console.log("saved " + inputs.email);

                    return finished();
                });
            });
        });
    },



    // Add a user to the database
    addStoresToDatabase: function (insertCount, inputsArray, callback) {

        // called when finished
        function finished(err) {
            if (err) {
                return callback(err);
            }

            if (insertCount < inputsArray.length - 1) {
                return this.addStoresToDatabase(insertCount, inputsArray, callback);
            }

            return callback();
        }

        var inputs = inputsArray[insertCount];

        // insert into database
        var query = "INSERT INTO Store.stores (name, updated_by) VALUES ('" + inputs.name + "', 1)";

        console.log("saving store " + inputs.name);
        database.executeQuery(query, function (err, result) {
            if (err) finished(err);

            console.log("saved " + inputs.name);

            return finished();
        });
    }

}




