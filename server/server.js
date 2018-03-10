"use strict";

Error.stackTraceLimit = 20; // node.js stacktrace line count

global.serverInstance = null;
global.isShuttingDown = false;
global.devMode = !(process.env.NODE_ENV == "production");


var hpp = require("hpp");
var path = require("path");
var helmet = require("helmet");
var locale = require("locale");
var express = require("express");
var passport = require("passport");
var requestIp = require("request-ip");
var bodyParser = require("body-parser");


var config = require("./config");
global.logSQLerrors = config.logSQLerrors;
global.validationRules = require("../www/js/shared/validation-rules.js");
global.dbName = config.mssql.database + ".dbo.";


// clear console
if (config.clearConsoleOnRestart) console.clear();


var router = require("./other/router");
var database = require("./database/database");


// Shows the filepath and line number of console.logs
if (config.showLogPaths) {

    // https://remysharp.com/2014/05/23/where-is-that-console-log
    ["log", "warn"].forEach(function(method) {
        var old = console[method];
        console[method] = function() {
            var stack = (new Error()).stack.split(/\n/);
            // Chrome includes a single "Error" line, FF doesn"t.
            if (stack[0].indexOf("Error") === 0) {
                stack = stack.slice(1);
            }
            var tempParts = stack[1].trim().split(/\\/);
            var filename = "    " + tempParts[tempParts.length - 1].replace(")", "");
            var args = [].slice.apply(arguments).concat([filename]);
            return old.apply(console, args);
        };
    });
}


var server = express();


// setup database
database.connect(config.mssql);

database.once("connected", function () {
    console.log("database connected");

    // security settings
    // https://helmetjs.github.io/docs/
    server.use(helmet.expectCt({ enforce: true, maxAge: 123 })); // Expect-CT
    server.use(helmet.dnsPrefetchControl()); // Prefetch-Control
    server.use(helmet.frameguard({ action: "deny" })); // X-Frame-Options
    server.use(helmet.hidePoweredBy()); // X-Powered-By
    server.use(helmet.hsts({ maxAge: 5184000 })); // Strict-Transport-Security (60 days)
    server.use(helmet.ieNoOpen()); // X-Download-Options
    server.use(helmet.noSniff()); // X-Content-Type-Options
    server.use(helmet.referrerPolicy({ policy: "no-referrer" })); // Referrer-Header
    server.use(helmet.xssFilter()); // X-XSS-Protection (safe for IE9+)


    // other express settings
    server.use(locale(config.supportedLanguages));
    server.use(requestIp.mw()); // get client IP on every request
    server.use(bodyParser.urlencoded({ extended: true, limit: 5242880 })); // 5MB
    server.use(bodyParser.json({ limit: 5242880 })); // 5MB
    server.use(passport.initialize());
    server.use(hpp()); // more security, stops duplicated querystring values


    // CORS - TODO : restrict to admin site and allow specific api calls only
    server.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    // override serve-static to stop it sending index.html
    server.use(function (req, res, next) {
        if (req.url == "/") return router.handlePrimaryPageRequest(req, res);

        next();
    });


    // static routes
    server.use("/", express.static(path.join(__dirname, "../", "www"), {
        maxAge: global.devMode ? 30 : 300000
    }));
    server.use(express.static(path.join(__dirname, "../", "data"), {
        maxAge: global.devMode ? 30 : 300000
    }));


    // Passport, mail, router
    require("./other/passport-auth").init(router);
    require("./other/mail").init();
    router.init(server);


    // start server
    var port = process.env.PORT || config.port;
    global.serverInstance = server.listen(port, function() {
        console.log("listening on port " + port);
    });
});



// this is run on shutdown
// the node instance stops after the server and database are closed
// azure will restart the server automatically
function shutdown(err) {
    console.log("shutting down");
    if (global.isShuttingDown)
        return;
    console.log("shutting down 2");
    global.isShuttingDown = true;

    if (err) console.log(err);

    if (database) {
        console.log("closing database");
        database.close();
    }

    if (global.serverInstance) {
        console.log("stopping server");
        global.serverInstance.close();
    }
}


// catch errors
server.once("error", shutdown);
database.once("errorConnecting", shutdown);
database.once("errorPool", shutdown);
process.once("uncaughtException", shutdown);
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);


exports = module.exports = server;