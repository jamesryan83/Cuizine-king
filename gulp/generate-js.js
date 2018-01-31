"use strict";

var fs = require("fs");
var path = require("path");
var uglify = require("uglify-js"); // TODO : setup uglify
var recursiveReadSync = require("recursive-readdir-sync");

var wwwFolder = path.join(__dirname, "../", "www");


exports = module.exports = {

    start: function () {
        var jsInputsPath = path.join(wwwFolder, "js");
        var outputsPath = path.join(wwwFolder, "generated");

        var jsFiles1 = recursiveReadSync(path.join(jsInputsPath, "cms"));
        var jsFiles2 = recursiveReadSync(path.join(jsInputsPath, "site"));
        var jsFiles3 = recursiveReadSync(path.join(jsInputsPath, "sysadmin"));
        var jsFiles4 = recursiveReadSync(path.join(jsInputsPath, "shared"));
        var jsFiles5 = recursiveReadSync(path.join(jsInputsPath, "controls"));

        var extraStuff = jsFiles4.concat(jsFiles5);

        var jsCmsFiles = jsFiles1.concat(extraStuff);
        var jsSiteFiles = jsFiles2.concat(extraStuff);
        var jsSysadminFiles = jsFiles3.concat(extraStuff);


        // add main js files to the start
        jsCmsFiles.unshift(path.join(jsInputsPath, "cms.js"));
        jsSiteFiles.unshift(path.join(jsInputsPath, "site.js"));
        jsSysadminFiles.unshift(path.join(jsInputsPath, "sysadmin.js"));

        var cmsJs = this.joinJsFilesTogetherSync(jsCmsFiles);
        var siteJs = this.joinJsFilesTogetherSync(jsSiteFiles);
        var sysadminJs = this.joinJsFilesTogetherSync(jsSysadminFiles);

        fs.writeFile(path.join(outputsPath, "_cms.js"), cmsJs, function (err){ if (err) console.log(err); });
        fs.writeFile(path.join(outputsPath, "_site.js"), siteJs, function (err){ if (err) console.log(err); });
        fs.writeFile(path.join(outputsPath, "_sysadmin.js"), sysadminJs, function (err){ if (err) console.log(err); });
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
