"use strict";

// handles the results from sql stored procedures


exports = module.exports = {

    // Returns data from a store procedure result
    getData: function (result, errStatus, errMessage, isJsonResult) {

        // Data result
        if (result && result.recordset && result.recordset.length > 0) {


            // regular data result
            var data = result.recordset[0];


            // parse json result
            if (isJsonResult) {
                // get data from sql server json result, the weird JSON GUID thing is constant
                data = result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];

                if (data.length === 0) {
                    return { err: { status: 200, message: "noData" }};
                }

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log("Error parsing json result");
                    return { err: { status: 500, message: "serverError" }};
                }

                // Data is missing
                if (Object.keys(data).length === 0) {
                    return { err: { status: 200, message: "noData" }};
                }
            }

            // return data
            return { data: data };
        }

        // Data is missing
        return { err: { status: errStatus || 204, message: errMessage || "noData" }};
    },



    // Returns an output parameter
    getOutputs: function (outputNames, result) {
        if (!outputNames || outputNames.length === 0)
            return { err: { status: 500, message: "outputNamesMissing" }};

        if (result.output) {
            var outputs = {};
            for (var i = 0; i < outputNames.length; i++) {
                outputs[outputNames[i]] = result.output[outputNames[i]];
            }

            return { outputs: outputs };
        }

        return { err: { status: 500, message: "databaseOutputMissing" }};
    },


    // This doesn't get localized
    // Returns the error message from an SQL THROW 50###, 'Some Message', 1
    getError: function (err) {
        if (err) {
            if (err.originalError && err.originalError.info && err.originalError.info.message) {

                var msg = err.originalError.info.message;
                var status = err.originalError.info.number.toString();
                status = status.substr(2, status.length);

                if (global.logSQLerrors) console.log(JSON.stringify(err.originalError.info));

                return { status: status, message: msg };
            }

            return { status: 500, message: "Server Error" };
        }

        return null;
    },

}

