"use strict";

Error.stackTraceLimit = 20; // node.js stacktrace line count

global.serverInstance = undefined;
global.isShuttingDown = false;
global.devMode = !(process.env.NODE_ENV == "production");


var hpp = require('hpp');
var path = require("path");
var helmet = require("helmet");
var express = require("express");
var passport = require("passport");
var requestIp = require("request-ip");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var MSSQLStore = require('connect-mssql')(session);


var config = require("./config");
global.logSQLerrors = config.logSQLerrors;
global.validationRules = require("../www/js/shared/validation-rules.js");
global.dbName = config.mssql.database + ".dbo.";


var router = require("./other/router");
var database = require("./database/database");


// Shows the filepath and line number of console.logs
if (config.showLogPaths) {

    // https://remysharp.com/2014/05/23/where-is-that-console-log
    ['log', 'warn'].forEach(function(method) {
        var old = console[method];
        console[method] = function() {
            var stack = (new Error()).stack.split(/\n/);
            // Chrome includes a single "Error" line, FF doesn't.
            if (stack[0].indexOf('Error') === 0) {
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



// After the database has connected
function onDatabaseConnected() {

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
    server.use(requestIp.mw()); // get client IP on every request
    server.use(bodyParser.urlencoded({ extended: true, limit: 5242880 })); // 5MB
    server.use(bodyParser.json({ limit: 5242880 })); // 5MB
    server.use(cookieParser());
    server.use(session({
        store: sessionStore,
        secret: config.secret,
        resave: true,
        saveUninitialized: true,
//        cookie: { expires: new Date(2147483647000) }
    }));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(hpp()); // more security, stops duplicated querystring values


    // override serve-static to stop it sending index.html
    server.use(function (req, res, next) {
        if (req.url == "/") {
            return router.renderPage(req, res);
        }
        next();
    });
    server.use("/", express.static(path.join(__dirname, "../", "www"), {
        maxAge: global.devMode ? 30 : 300000
    }));
    server.use(express.static(path.join(__dirname, "../", "fakedata")));


    // Passport, mail, router
    require("./other/passport-auth").init(router);
    require("./other/mail").init();
    router.init(server);


    // start server
    var port = process.env.PORT || config.port;
    serverInstance = server.listen(port, function() {
        console.log("listening on port " + port);
    });
}



// setup database
// both sessions db and regular db
// have to be connected before starting the server
var sessionStoreConnected = false;
var databaseConnected = false;
var sessionStore = new MSSQLStore(config.mssql);
database.connect(config.mssql);

sessionStore.once("connect", function () {
    sessionStoreConnected = true;
    console.log("session store connected");
    if (databaseConnected) onDatabaseConnected();
});

database.once("connected", function () {
    databaseConnected = true;
    console.log("database connected");
    if (sessionStoreConnected) onDatabaseConnected();
});



// this is run on shutdown
// the node instance stops after the server and database are closed
// azure will restart the server automatically
function shutdown(err, err2) {
    console.log("shutting down");
    if (isShuttingDown)
        return;
    console.log("shutting down 2");
    isShuttingDown = true;

    if (err) console.log(err);

    if (database) {
        console.log("closing database");
        database.close();
    }

    if (sessionStore) {
        console.log("closing session store");
        sessionStore.connection.pool.release(); // TODO : do these work ?
        sessionStore.connection.pool.destroy();
        sessionStore = null;
    }

    if (serverInstance) {
        console.log("stopping server");
        serverInstance.close();
    }
}


// catch errors
server.once("error", shutdown);
database.once("errorConnecting", shutdown);
database.once("errorPool", shutdown);
sessionStore.once("error", shutdown);
process.once("uncaughtException", shutdown);
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);


exports = module.exports = server;