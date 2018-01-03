"use strict";

// Run tests
// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
// https://stackoverflow.com/questions/18660916/how-can-i-subscribe-to-mocha-suite-events

var path = require('path');
var Mocha = require('mocha');

var mocha = new Mocha({ bail: true });


mocha.addFile(path.join(__dirname, "database", "database.js"));
mocha.addFile(path.join(__dirname, "database", "procedures", "people.js"));
mocha.addFile(path.join(__dirname, "database", "procedures", "stores.js"));

mocha.addFile(path.join(__dirname, "routes", "router.js"));
//mocha.addFile(path.join(__dirname, "routes", "pages.js"));

//mocha.addFile(path.join(__dirname, "api", "auth.js"));
//mocha.addFile(path.join(__dirname, "api", "me.js"));
//mocha.addFile(path.join(__dirname, "api", "companies.js"));
//mocha.addFile(path.join(__dirname, "api", "users.js"));

//mocha.addFile(path.join(__dirname, "load", "database.js"));

// Run the tests
mocha.run(function (failures) {
    process.on('exit', function () {
        process.exit(failures);
    });

    process.exit(0);
});
