"use strict";

// handles the results from sql stored procedures

exports = module.exports = {


    // Handles results for specific stored procedures
    handle: function (procedure, err, result, callback, inputs) {
        if (err) {
            return this.returnError(err, callback);
        }

        switch (procedure) {
            case "stores_get":
                this.returnResult(result, 400, "Store not found", callback, true);
                break;

            case "people_get":
                this.returnResult(result, 400, "Account not found", callback);
                break;

            case "test":
                this.returnResult(result, 200, null, callback);
                break;

            case "people_create":
            case "people_validate_email":
            default:
                return callback(null);
        }
    },


    // Returns the result
    returnResult: function (result, status, message, callback, isJsonResult) {

        // data result
        if (result.recordset && result.recordset.length > 0) {

            // regular data result
            var data = result.recordset[0];

            // parse json result
            if (isJsonResult) {
                data = result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]

                if (data.length === 0) {
                    return callback({ status: status, message: message });
                }

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log("Error parsing json result");
                    return ({ status: 500, message: "Server error" });
                }
            }

            return callback(null, data);

        // regular result
        } else {
            return callback({ status: status, message: message });
        }
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



//case "login_attempts_add":
//    break;
//
//case "people_delete":
//    return callback(null);
//    break;
//case "users_pending_add":
//    var rowsChanged = result.rowsAffected.reduce(function (t, n) { return t + n });
//    if (rowsChanged > 0) {
//        return callback(null);
//    } else {
//        return callback({ status: 500, message: "Server Error" });
//    }
//    break;
//case "users_pending_move_to_users":
//    var rowsChanged = result.rowsAffected.reduce(function (t, n) { return t + n });
//    if (rowsChanged > 0) {
//        return callback(null);
//    } else {
//        return callback({ status: 500, message: "Server Error" });
//    }
//    break;
//case "users_update":
//    var rowsChanged = result.rowsAffected.reduce(function (t, n) { return t + n });
//    if (rowsChanged > 0) {
//        return callback(null);
//    } else {
//        return callback({ status: 401, message: "Account not found" });
//    }
//    break;
//case "users_update_reset_password_token":
//    var rowsChanged = result.rowsAffected.reduce(function (t, n) { return t + n });
//    if (rowsChanged > 0) {
//        return callback(null);
//    } else {
//        return callback({ status: 401, message: "Account not found" });
//    }
//    break;