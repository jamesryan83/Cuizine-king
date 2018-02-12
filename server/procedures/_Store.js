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


	// Store.store_applications_create
	store_applications_create: function (inputs, callback) {
		database.pool.request()
			.input("name", sql.NVarChar, inputs.name)
			.input("email", sql.NVarChar, inputs.email)
			.input("message", sql.NVarChar, inputs.message)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.output("newStoreApplicationId", sql.Int)
			.execute(config.mssql.database + ".dbo.store_applications_create", function (err, result) {
				return resultHandler.handle("store_applications_create", err, result, callback, inputs);
		});
	},


	// Store.stores_create
	stores_create: function (inputs, callback) {
		database.pool.request()
			.input("postcode", sql.NVarChar, inputs.postcode)
			.input("suburb", sql.NVarChar, inputs.suburb)
			.input("street_address", sql.NVarChar, inputs.street_address)
			.input("first_name", sql.NVarChar, inputs.first_name)
			.input("last_name", sql.NVarChar, inputs.last_name)
			.input("phone_number_user", sql.NVarChar, inputs.phone_number_user)
			.input("email_user", sql.NVarChar, inputs.email_user)
			.input("password", sql.NVarChar, inputs.password)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.input("name", sql.NVarChar, inputs.name)
			.input("abn", sql.NVarChar, inputs.abn)
			.input("internal_notes_store", sql.NVarChar, inputs.internal_notes_store)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.output("newStoreId", sql.Int)
			.output("newPersonId", sql.Int)
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


	// Store.stores_undelete
	stores_undelete: function (inputs, callback) {
		database.pool.request()
			.input("id_store", sql.Int, inputs.id_store)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.execute(config.mssql.database + ".dbo.stores_undelete", function (err, result) {
				return resultHandler.handle("stores_undelete", err, result, callback, inputs);
		});
	},


}
