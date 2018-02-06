"use strict";

// handles the results from sql stored procedures

exports = module.exports = {


    // Handles results for specific stored procedures
    handle: function (procedure, err, result, callback, inputs) {
        if (err) return this.returnError(err, callback);

        switch (procedure) {
            case "people_create_web_user":
            case "people_create_store_user":
            case "people_create_system_user":
                return this.returnOutput(["newPersonId"], result, callback);
                break;

            case "people_get_by_id":
            case "people_get_by_email":
            case "people_get_by_jwt":
            case "people_update_jwt":
                return this.returnResult(result, 400, "Account not found", callback);
                break;

            case "people_invalidate_jwt":
                return callback(null, result.rowsAffected)
                break;

            case "store_applications_create":
                return this.returnOutput(["newStoreApplicationId"], result, callback);
                break;

            case "stores_create":
                return this.returnOutput(["newStoreId", "newPersonId"], result, callback);
                break;

            case "stores_get":
                this.returnResult(result, 400, "Store not found", callback, true);
                break;


            // These are for tests
            case "test_result":
                this.returnResult(result, null, null, callback);
                break;
            case "test_result_error":
                this.returnResult(result, 123, "test message", callback);
                break;
            case "test_null_err_result":
                return callback(null);
                break;
            case "test_output":
                return this.returnOutput(["id_test"], result, callback);
                break;


            // these procedures don't return anything
            case "people_update_password":
            case "people_update_is_verified":
            case "people_update_reset_password_token":
            case "reviews_get":
            case "stores_delete":
            case "stores_undelete":
            default:
                return callback(null);
        }
    },


    // Returns the result
    returnResult: function (result, errStatus, errMessage, callback, isJsonResult) {

        // Data result
        if (result.recordset && result.recordset.length > 0) {

            // regular data result
            var data = result.recordset[0];

            // parse json result
            if (isJsonResult) {
                // get data from sql server json result, the weird JSON GUID thing is constant
                data = result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];

                if (data.length === 0) {
                    return callback({ status: errStatus || 500, message: errMessage || "No Data" });
                }

                try {
                    data = JSON.parse(data)[0];
                } catch (e) {
                    console.log("Error parsing json result");
                    return ({ status: 500, message: "Server error" });
                }

                // Data is missing
                if (Object.keys(data).length === 0) {
                    return callback({ status: errStatus || 500, message: errMessage || "Server Error" });
                }
            }

            // return data
            return callback(null, data);
        }

        // Data is missing
        return callback({ status: errStatus || 500, message: errMessage || "Server Error" });
    },



    // Returns an output parameter
    returnOutput: function (outputNames, result, callback) {
        if (result.output) {
            var outputs = {};
            for (var i = 0; i < outputNames.length; i++) {
                outputs[outputNames[i]] = result.output[outputNames[i]];
            }

            return callback(null, outputs);
        }

        return callback({ status: 500, message: "Database output missing" });
    },



    // Returns the error message from an SQL THROW 50###, 'Some Message', 1
    returnError: function (err, callback) {
        if (err.originalError && err.originalError.info && err.originalError.info.message) {

            var msg = err.originalError.info.message;
            var status = err.originalError.info.number.toString();
            status = status.substr(2, status.length);

            if (global.logSQLerrors) console.log(JSON.stringify(err.originalError.info));

            return callback({ status: status, message: msg })
        }

        return callback({ status: 500, message: "Server Error" });
    }

}

