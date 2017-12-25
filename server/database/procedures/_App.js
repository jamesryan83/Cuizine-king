// GENERATED

"use strict";

var sql = require("mssql");

var config = require("../../config");
var database = require("../database");
var resultHandler = require("../result-handler");

var dbName = config.mssql.database + ".dbo.";


// Calls stored procedures for App
exports = module.exports = {

	// App.people_create
	people_create: function (inputs, callback) {
		database.pool.request()
			.input("postcode", sql.NVarChar, inputs.postcode)
			.input("suburb", sql.NVarChar, inputs.suburb)
			.input("address_line_1", sql.NVarChar, inputs.address_line_1)
			.input("address_line_2", sql.NVarChar, inputs.address_line_2)
			.input("address_latitude", sql.Decimal, inputs.address_latitude)
			.input("address_longitude", sql.Decimal, inputs.address_longitude)
			.input("first_name", sql.NVarChar, inputs.first_name)
			.input("last_name", sql.NVarChar, inputs.last_name)
			.input("email", sql.NVarChar, inputs.email)
			.input("phone_number", sql.NVarChar, inputs.phone_number)
			.input("password", sql.NVarChar, inputs.password)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.input("is_verified", sql.Bit, inputs.is_verified)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.input("is_system_user", sql.Bit, inputs.is_system_user)
			.input("is_web_user", sql.Bit, inputs.is_web_user)
			.input("internal_notes", sql.NVarChar, inputs.internal_notes)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.execute(dbName + "people_create", function (err, result) {
				return resultHandler.handle("people_create", err, result, callback, inputs);
		});
	},


	// App.people_get
	people_get: function (inputs, callback) {
		database.pool.request()
			.input("id", sql.Int, inputs.id)
			.input("email", sql.NVarChar, inputs.email)
			.execute(dbName + "people_get", function (err, result) {
				return resultHandler.handle("people_get", err, result, callback, inputs);
		});
	},


}
