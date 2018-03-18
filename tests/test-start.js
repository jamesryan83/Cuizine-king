"use strict";

// Run tests
// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
// https://stackoverflow.com/questions/18660916/how-can-i-subscribe-to-mocha-suite-events

var path = require("path");
var Mocha = require("mocha");

var mocha = new Mocha({ bail: true });


mocha.addFile(path.join(__dirname, "database", "result-handler.js"));
mocha.addFile(path.join(__dirname, "database", "database.js"));
mocha.addFile(path.join(__dirname, "other", "jwt.js"));
mocha.addFile(path.join(__dirname, "procedures", "App.js"));
mocha.addFile(path.join(__dirname, "procedures", "Store.js"));
mocha.addFile(path.join(__dirname, "routes", "router.js"));
mocha.addFile(path.join(__dirname, "database", "result-modifier.js"));
mocha.addFile(path.join(__dirname, "api", "auth.js"));
mocha.addFile(path.join(__dirname, "api", "location.js"));
mocha.addFile(path.join(__dirname, "api", "stores.js"));
mocha.addFile(path.join(__dirname, "api", "sysadmin.js"));
mocha.addFile(path.join(__dirname, "routes", "pages.js"));
mocha.addFile(path.join(__dirname, "other", "validation-rules.js"));
mocha.addFile(path.join(__dirname, "client", "util.js"));
mocha.addFile(path.join(__dirname, "client", "data.js"));
mocha.addFile(path.join(__dirname, "other", "load-database.js"));


// Run the tests
mocha.run(function (failures) {
    process.on("exit", function () {
        process.exit(failures);
    });

    process.exit(0);
});
