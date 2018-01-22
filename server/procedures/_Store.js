// GENERATED

"use strict";

var sql = require("mssql");

var config = require("../config");
var database = require("../database/database");
var resultHandler = require("../database/result-handler");

// Calls stored procedures for Store
exports = module.exports = {

	// Store.reviews_get
	reviews_get: function (inputs, callback) {
		database.pool.request()
			.input("id_store", sql.Int, inputs.id_store)
			.execute(config.mssql.database + ".dbo.reviews_get", function (err, result) {
				return resultHandler.handle("reviews_get", err, result, callback, inputs);
		});
	},


	// Store.stores_create
	stores_create: function (inputs, callback) {
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
			.input("phone_number_user", sql.NVarChar, inputs.phone_number_user)
			.input("password", sql.NVarChar, inputs.password)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.input("internal_notes_user", sql.NVarChar, inputs.internal_notes_user)
			.input("logo", sql.NVarChar, inputs.logo)
			.input("name", sql.NVarChar, inputs.name)
			.input("description", sql.NVarChar, inputs.description)
			.input("phone_number_store", sql.NVarChar, inputs.phone_number_store)
			.input("website", sql.NVarChar, inputs.website)
			.input("facebook", sql.NVarChar, inputs.facebook)
			.input("twitter", sql.NVarChar, inputs.twitter)
			.input("abn", sql.NVarChar, inputs.abn)
			.input("internal_notes_store", sql.NVarChar, inputs.internal_notes_store)
			.input("bank_name", sql.NVarChar, inputs.bank_name)
			.input("bank_bsb", sql.NVarChar, inputs.bank_bsb)
			.input("bank_account_name", sql.NVarChar, inputs.bank_account_name)
			.input("bank_account_number", sql.NVarChar, inputs.bank_account_number)
			.input("hours_mon_dinein_open", sql.NVarChar, inputs.hours_mon_dinein_open)
			.input("hours_tue_dinein_open", sql.NVarChar, inputs.hours_tue_dinein_open)
			.input("hours_wed_dinein_open", sql.NVarChar, inputs.hours_wed_dinein_open)
			.input("hours_thu_dinein_open", sql.NVarChar, inputs.hours_thu_dinein_open)
			.input("hours_fri_dinein_open", sql.NVarChar, inputs.hours_fri_dinein_open)
			.input("hours_sat_dinein_open", sql.NVarChar, inputs.hours_sat_dinein_open)
			.input("hours_sun_dinein_open", sql.NVarChar, inputs.hours_sun_dinein_open)
			.input("hours_mon_dinein_close", sql.NVarChar, inputs.hours_mon_dinein_close)
			.input("hours_tue_dinein_close", sql.NVarChar, inputs.hours_tue_dinein_close)
			.input("hours_wed_dinein_close", sql.NVarChar, inputs.hours_wed_dinein_close)
			.input("hours_thu_dinein_close", sql.NVarChar, inputs.hours_thu_dinein_close)
			.input("hours_fri_dinein_close", sql.NVarChar, inputs.hours_fri_dinein_close)
			.input("hours_sat_dinein_close", sql.NVarChar, inputs.hours_sat_dinein_close)
			.input("hours_sun_dinein_close", sql.NVarChar, inputs.hours_sun_dinein_close)
			.input("hours_mon_delivery_open", sql.NVarChar, inputs.hours_mon_delivery_open)
			.input("hours_tue_delivery_open", sql.NVarChar, inputs.hours_tue_delivery_open)
			.input("hours_wed_delivery_open", sql.NVarChar, inputs.hours_wed_delivery_open)
			.input("hours_thu_delivery_open", sql.NVarChar, inputs.hours_thu_delivery_open)
			.input("hours_fri_delivery_open", sql.NVarChar, inputs.hours_fri_delivery_open)
			.input("hours_sat_delivery_open", sql.NVarChar, inputs.hours_sat_delivery_open)
			.input("hours_sun_delivery_open", sql.NVarChar, inputs.hours_sun_delivery_open)
			.input("hours_mon_delivery_close", sql.NVarChar, inputs.hours_mon_delivery_close)
			.input("hours_tue_delivery_close", sql.NVarChar, inputs.hours_tue_delivery_close)
			.input("hours_wed_delivery_close", sql.NVarChar, inputs.hours_wed_delivery_close)
			.input("hours_thu_delivery_close", sql.NVarChar, inputs.hours_thu_delivery_close)
			.input("hours_fri_delivery_close", sql.NVarChar, inputs.hours_fri_delivery_close)
			.input("hours_sat_delivery_close", sql.NVarChar, inputs.hours_sat_delivery_close)
			.input("hours_sun_delivery_close", sql.NVarChar, inputs.hours_sun_delivery_close)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.execute(config.mssql.database + ".dbo.stores_create", function (err, result) {
				return resultHandler.handle("stores_create", err, result, callback, inputs);
		});
	},


	// Store.stores_delete
	stores_delete: function (inputs, callback) {
		database.pool.request()
			.input("id_store", sql.Int, inputs.id_store)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.execute(config.mssql.database + ".dbo.stores_delete", function (err, result) {
				return resultHandler.handle("stores_delete", err, result, callback, inputs);
		});
	},


	// Store.stores_get
	stores_get: function (inputs, callback) {
		database.pool.request()
			.input("id_store", sql.Int, inputs.id_store)
			.execute(config.mssql.database + ".dbo.stores_get", function (err, result) {
				return resultHandler.handle("stores_get", err, result, callback, inputs);
		});
	},


}
