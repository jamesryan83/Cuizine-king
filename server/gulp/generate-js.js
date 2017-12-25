"use strict";

var fs = require("fs");
var path = require("path");
var uglify = require("uglify-js");
var recursiveReadSync = require("recursive-readdir-sync");

var wwwFolder = path.join(__dirname, "../", "../", "www");

exports = module.exports = {

    start: function () {
        var jsInputsPath = path.join(wwwFolder, "js");
        var outputsPath = path.join(wwwFolder, "generated");

        var jsFiles1 = recursiveReadSync(path.join(jsInputsPath, "loggedin"));
        var jsFiles2 = recursiveReadSync(path.join(jsInputsPath, "loggedout"));
        var jsFiles3 = recursiveReadSync(path.join(jsInputsPath, "shared"));

        var jsLoggedInFiles = jsFiles1.concat(jsFiles3);
        var jsLoggedOutFiles = jsFiles2.concat(jsFiles3);

        // add logged-in/out filepaths to the start
        jsLoggedInFiles.unshift(path.join(jsInputsPath, "logged-in.js"));
        jsLoggedOutFiles.unshift(path.join(jsInputsPath, "logged-out.js"));

        var loggedInJs = this.joinJsFilesTogetherSync(jsLoggedInFiles);
        var loggedOutJs = this.joinJsFilesTogetherSync(jsLoggedOutFiles);

        // remove the extra use strict's and var app...'s
        loggedInJs = loggedInJs.replace(/"use strict"(;?)/g, "");
        loggedOutJs = loggedOutJs.replace(/"use strict"(;?)/g, "");
        loggedInJs = loggedInJs.replace(/var(\s*)app(\s*)=(\s*)app(\s*)\|\|(\s*){}(;?)/g, "");
        loggedOutJs = loggedOutJs.replace(/var(\s*)app(\s*)=(\s*)app(\s*)\|\|(\s*){}(;?)/g, "");

        // add them back on to start of combined js
        loggedInJs = '"use strict";\n\nvar app = app || {};' + loggedInJs;
        loggedOutJs = '"use strict";\n\nvar app = app || {};' + loggedOutJs;

        fs.writeFile(path.join(outputsPath, "logged-in.js"), loggedInJs, function (err){ if (err) console.log(err); });
        fs.writeFile(path.join(outputsPath, "logged-out.js"), loggedOutJs, function (err){ if (err) console.log(err); });
    },


    // Concatenate file contents from an array of file paths
    joinJsFilesTogetherSync: function (files) {
        var data = "";
        for (var i = 0; i < files.length; i++) {
            var js = fs.readFileSync(files[i], "utf-8");

            // remove node stuff
            var nodeIndex = js.indexOf("if (typeof module !=");
            if (nodeIndex !== -1) {
                js = js.substr(0, nodeIndex);
            }

            data += js;
        }

        return data;
    },


}
