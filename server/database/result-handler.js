"use strict";

// handles the results from sql stored procedures

exports = module.exports = {


    // Handles results for specific stored procedures
    handle: function (procedure, err, result, callback, inputs) {
        if (err) {
            return this.returnError(err, callback);
        }

        switch (procedure) {
            case "people_create_web_user":
                return this.returnOutput("newPersonId", result, callback);
                break;

            case "people_get_by_id":
            case "people_get_by_email":
            case "people_get_by_jwt":
                return this.returnResult(result, 400, "Account not found", callback);
                break;

            case "people_update_jwt":
                return this.returnOutput("id_person", result, callback);
                break;

            case "people_invalidate_jwt":
                return callback(null, result.rowsAffected)
                break;


            case "reviews_get":
                return callback(null);
                break;

            case "stores_create":
                return callback(null);
                break;

            case "stores_delete":
                return callback(null);
                break;

            case "stores_get":
                this.returnResult(result, 400, "Store not found", callback, true);
                break;


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
                return this.returnOutput("id_test", result, callback);
                break;


            case "people_update_password":
            case "people_update_is_verified":
            case "people_update_reset_password_token":
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
                data = result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]

                if (data.length === 0) {
                    return callback({ status: errStatus || 500, message: errMessage || "No Data" });
                }

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log("Error parsing json result");
                    return ({ status: 500, message: "Server error" });
                }

                // Data is missing
                if (Object.keys(data).length === 0) {
                    return callback({ status: errStatus || 500, message: errMessage || "Server Error" });
                }
            }

            // data ok
            return callback(null, data);
        }

        // Data is missing
        return callback({ status: errStatus || 500, message: errMessage || "Server Error" });
    },



    // Returns an output parameter
    returnOutput: function (outputName, result, callback) {
        if (result.output) {
            return callback(null, result.output[outputName]);
        }

        return callback({ status: 500, message: "Output missing" });
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




// This is what the mssql error object looks like
//{
//    "code": "EREQUEST",
//    "number": 201,
//    "lineNumber": 0,
//    "state": 4,
//    "class": 16,
//    "serverName": "JAMES-LAPTOP\\SQLEXPRESS",
//    "procName": "users_pending_add",
//    "originalError": {
//        "info": {
//            "number": 201,
//            "state": 4,
//            "class": 16,
//            "message": "Procedure or function 'users_pending_add' expects parameter '@type', which was not supplied.",
//            "serverName": "JAMES-LAPTOP\\SQLEXPRESS",
//            "procName": "users_pending_add",
//            "lineNumber": 0,
//            "name": "ERROR",
//            "event": "errorMessage"
//        }
//    },
//    "name": "RequestError",
//    "precedingErrors": []
//}


