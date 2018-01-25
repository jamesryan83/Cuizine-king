"use strict";

// https://docs.microsoft.com/en-us/azure/store-sendgrid-nodejs-how-to-send-email
// https://github.com/sendgrid/sendgrid-nodejs/blob/master/packages/mail/USE_CASES.md


// Emails
var sendgrid = require("@sendgrid/mail");

var config = require("../config");


exports = module.exports = {

    init: function () {
        sendgrid.setApiKey(config.mail.apikey);
    },


    // User registration email
    sendUserRegistrationEmail: function (first_name, email, token, callback) {
        var link = config.host +  "/verify-account?t=" + token;

        if (global.devMode) console.log(link);

        var body = "<p>Hi " + first_name + ".  Please <a href='" + link +
            "'>Click here</a> to verify your email address</p>";

        this.sendEmail(email, "Welcome to " + config.title, body, callback);
    },


    // Forgot password email
    sendForgotPasswordEmail: function (email, token, callback) {
        var link = config.host + "/reset-password?t=" + token;

        if (global.devMode) console.log(link);

        var body = "<p>Please click the link below to reset your password</p>" +
            "<a href='" + link + "'>Click here to reset your password</a>";

        this.sendEmail(email, config.title + " - Reset Password", body, callback);
    },


    // Thanks for verifying email
    sendThanksForVerifyingEmail: function (email, callback) {
        var body = "<p>Thanks for verifying your account</p>";

        this.sendEmail(email, config.title + " - Thanks for verifying your account", body, callback);
    },


    // Sends a store application form
    sendStoreApplicationEmail: function (name, email, callback) {
        var body = "<p>Hi " + name + ".  Thanks for your enquiry.  Attached is a store application form for you to complete.</p>";

        this.sendEmail(email, config.title + " - Thanks for your enquiry", body, callback);
    },


    // Send an email
    sendEmail: function (email, subject, message, callback) {
        if (!global.devMode) {
            sendgrid.send({
                to: email,
                from: config.mail.serverEmail,
                subject: subject,
                text: message,
                html: message
            }, function (err, result) {
                if (err) {
                    console.log(err)
                    return callback(err);
                }

                return callback(null);
            });
        } else {
            return callback(null);
        }
    },

}
