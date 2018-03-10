// GENERATED

"use strict";

var sql = require("mssql");

var config = require("../config");
var database = require("../database/database");

// Calls stored procedures for App
exports = module.exports = {

	// App.addresses_create_or_update
	addresses_create_or_update: function (inputs, callback) {
		database.pool.request()
			.input("id_address", sql.Int, inputs.id_address)
			.input("postcode", sql.NVarChar, inputs.postcode)
			.input("suburb", sql.NVarChar, inputs.suburb)
			.input("street_address", sql.NVarChar, inputs.street_address)
			.input("id_user_doing_update", sql.Int, inputs.id_user_doing_update)
			.output("newAddressId", sql.Int)
			.execute(config.mssql.database + ".dbo.addresses_create_or_update", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


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
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
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
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
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
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_delete
	people_delete: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_delete", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_get_by_email
	people_get_by_email: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.execute(config.mssql.database + ".dbo.people_get_by_email", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_get_by_id
	people_get_by_id: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.execute(config.mssql.database + ".dbo.people_get_by_id", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_get_by_jwt
	people_get_by_jwt: function (inputs, callback) {
		database.pool.request()
			.input("jwt", sql.NVarChar, inputs.jwt)
			.input("id_person", sql.Int, inputs.id_person)
			.execute(config.mssql.database + ".dbo.people_get_by_jwt", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_invalidate_jwt
	people_invalidate_jwt: function (inputs, callback) {
		database.pool.request()
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_invalidate_jwt", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_update_is_verified
	people_update_is_verified: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("verification_token", sql.NVarChar, inputs.verification_token)
			.execute(config.mssql.database + ".dbo.people_update_is_verified", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_update_jwt
	people_update_jwt: function (inputs, callback) {
		database.pool.request()
			.input("id_person", sql.Int, inputs.id_person)
			.input("jwt", sql.NVarChar, inputs.jwt)
			.execute(config.mssql.database + ".dbo.people_update_jwt", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_update_password
	people_update_password: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("reset_password_token", sql.NVarChar, inputs.reset_password_token)
			.input("password", sql.NVarChar, inputs.password)
			.execute(config.mssql.database + ".dbo.people_update_password", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


	// App.people_update_reset_password_token
	people_update_reset_password_token: function (inputs, callback) {
		database.pool.request()
			.input("email", sql.NVarChar, inputs.email)
			.input("reset_password_token", sql.NVarChar, inputs.reset_password_token)
			.execute(config.mssql.database + ".dbo.people_update_reset_password_token", function (err, result) {
				var sqlErr = database.resultHandler.getError(err);
				if (sqlErr) return callback(sqlErr);

				return callback(null, result);
		});
	},


}
