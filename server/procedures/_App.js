// GENERATED

"use strict";

var sql = require("mssql");

var config = require("../config");
var database = require("../database/database");
var resultHandler = require("../database/result-handler");

// Calls stored procedures for App
exports = module.exports = {

	// App.people_create_store_user
	people_create_store_user: function (inputs, callback) {
		database.pool.request()
			.input("id_store", sql.Int, inputs.id_store)
			.input("first_name", sql.NVarChar, inputs.first_name)
			.input("last_name", sql.NVarChar, inputs.last_name)
			.input("email", sql.NVarChar, inputs.email)
			.input("password", sql.NVarChar, inputs.password)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.output("newPersonId", sql.Int)
			.execute(config.mssql.database + ".dbo.people_create_store_user", function (err, result) {
				return resultHandler.handle("people_create_store_user", err, result, callback, inputs);
		});
	},


	// App.people_create_system_user
	people_create_system_user: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("password", sql.NVarChar, inputs.password)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.output("newPersonId", sql.Int)
			.execute(config.mssql.database + ".dbo.people_create_system_user", function (err, result) {
				return resultHandler.handle("people_create_system_user", err, result, callback, inputs);
		});
	},


	// App.people_create_web_user
	people_create_web_user: function (inputs, callback) {
		database.pool.request()
			.input("first_name", sql.NVarChar, inputs.first_name)
			.input("last_name", sql.NVarChar, inputs.last_name)
			.input("email", sql.NVarChar, inputs.email)
			.input("password", sql.NVarChar, inputs.password)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.output("newPersonId", sql.Int)
			.execute(config.mssql.database + ".dbo.people_create_web_user", function (err, result) {
				return resultHandler.handle("people_create_web_user", err, result, callback, inputs);
		});
	},


	// App.people_delete
	people_delete: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_delete", function (err, result) {
				return resultHandler.handle("people_delete", err, result, callback, inputs);
		});
	},


	// App.people_get_by_email
	people_get_by_email: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.execute(config.mssql.database + ".dbo.people_get_by_email", function (err, result) {
				return resultHandler.handle("people_get_by_email", err, result, callback, inputs);
		});
	},


	// App.people_get_by_id
	people_get_by_id: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.execute(config.mssql.database + ".dbo.people_get_by_id", function (err, result) {
				return resultHandler.handle("people_get_by_id", err, result, callback, inputs);
		});
	},


	// App.people_get_by_jwt
	people_get_by_jwt: function (inputs, callback) {
		database.pool.request()
			.input("jwt", sql.NVarChar, inputs.jwt)
			.input("id_person", sql.Int, inputs.id_person)
			.execute(config.mssql.database + ".dbo.people_get_by_jwt", function (err, result) {
				return resultHandler.handle("people_get_by_jwt", err, result, callback, inputs);
		});
	},


	// App.people_invalidate_jwt
	people_invalidate_jwt: function (inputs, callback) {
		database.pool.request()
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_invalidate_jwt", function (err, result) {
				return resultHandler.handle("people_invalidate_jwt", err, result, callback, inputs);
		});
	},


	// App.people_update_is_verified
	people_update_is_verified: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.execute(config.mssql.database + ".dbo.people_update_is_verified", function (err, result) {
				return resultHandler.handle("people_update_is_verified", err, result, callback, inputs);
		});
	},


	// App.people_update_jwt
	people_update_jwt: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_update_jwt", function (err, result) {
				return resultHandler.handle("people_update_jwt", err, result, callback, inputs);
		});
	},


	// App.people_update_password
	people_update_password: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("reset_password_token", sql.NVarChar, inputs.reset_password_token)
			.input("password", sql.NVarChar, inputs.password)
			.execute(config.mssql.database + ".dbo.people_update_password", function (err, result) {
				return resultHandler.handle("people_update_password", err, result, callback, inputs);
		});
	},


	// App.people_update_reset_password_token
	people_update_reset_password_token: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("reset_password_token", sql.NVarChar, inputs.reset_password_token)
			.execute(config.mssql.database + ".dbo.people_update_reset_password_token", function (err, result) {
				return resultHandler.handle("people_update_reset_password_token", err, result, callback, inputs);
		});
	},


}
