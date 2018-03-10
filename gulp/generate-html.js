"use strict";

var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var uglify = require("uglify-js");
var minify = require("html-minifier").minify; // TODO : setup minify
var recursiveReadSync = require("recursive-readdir-sync");

var config = require("../server/config");
var cmsRouter = require("../www/js/cms");
var siteRouter = require("../www/js/site");
var sysadminRouter = require("../www/js/sysadmin");

var wwwFolder = path.join(__dirname, "../", "www");



exports = module.exports = {

    htmlFilePaths: null,
    htmlInputsPath: null,


    // Start
    start: function () {
        var outputsPath = path.join(wwwFolder, "generated");
        var htmlFolder = path.join(wwwFolder, "html");

        this.htmlFilePaths = recursiveReadSync(htmlFolder);
        var dialogFilePaths = recursiveReadSync(path.join(htmlFolder, "dialogs"));


        // get html filenames and check for duplicates
        var htmlFileNames = this.htmlFilePaths.map(function (x) {
            var a = x.split("\\");
            return a[a.length - 1];
        }).sort();
        for (var i = 0; i < htmlFileNames.length - 1; i++) {
            if (htmlFileNames[i + 1] == htmlFileNames[i])
                throw new Error("Html filenames must be unique.  Duplicate name: " + htmlFileNames[i]);
        }


        // create json files with html pages
        var htmlOutputCms = this.compileHtmlList(
            cmsRouter.routesList, cmsRouter.routes);

        var htmlOutputSite = this.compileHtmlList(
            siteRouter.routesList, siteRouter.routes);

        var htmlOutputSysadmin = this.compileHtmlList(
            sysadminRouter.routesList, sysadminRouter.routes);


        // add dialogs to html
        htmlOutputCms = this.addDialogs(htmlOutputCms, dialogFilePaths);
        htmlOutputSite = this.addDialogs(htmlOutputSite, dialogFilePaths);
        htmlOutputSysadmin = this.addDialogs(htmlOutputSysadmin, dialogFilePaths);

        fs.writeFileSync(path.join(outputsPath, "_cms.json"), JSON.stringify(htmlOutputCms));
        fs.writeFileSync(path.join(outputsPath, "_site.json"), JSON.stringify(htmlOutputSite));
        fs.writeFileSync(path.join(outputsPath, "_sysadmin.json"), JSON.stringify(htmlOutputSysadmin));


        // compile main index file
        var startupScript = fs.readFileSync(path.join(wwwFolder, "js", "main.js"), "utf-8");
        if (config.minifyjs) startupScript = uglify.minify(startupScript).code;

        var main = this.compileHtml(path.join(htmlFolder, "main.html"), {
            startupScript: startupScript
        });
        main = "<!-- GENERATED -->\n\n" + main;

        fs.writeFileSync(path.join(path.join(wwwFolder, "_index-main.html")), main);
    },



    // Compile single html page
    compileHtml: function (htmlFilePath, data) {
        var self = this;

        var html = fs.readFileSync(htmlFilePath, "utf8");
        var compiledHtml = ejs.compile(html, {
            client: true,
            delimiter: "?"
        });

        // the callback here is fired for each include found
        return compiledHtml(data, null, function (include) {
            if (include) {

                // if there is an include in this file, get the filepath
                var pagePath = self.htmlFilePaths.filter(function (filePath) {
                    return path.parse(filePath).name == include;
                })[0];

                return self.compileHtml(pagePath, data); // recursive
            }
        });
    },



    // Compile a list of html pages into a json file
    compileHtmlList: function (routes, dataList) {
        var htmlOutput = {};

        // for each route
        for (var i = 0; i < routes.length; i++) {
            var pageData = dataList[routes[i]];

            // ignore some pages
            if (Object.keys(pageData).length === 0) continue;
            if (!pageData.file) continue;

            pageData.isCordova = config.isCordova;

            var output = this.compileHtml(this.htmlFilePaths.filter(function (filePath) {
                return path.parse(filePath).name == pageData.file;
            })[0], pageData);

            // add html to output object with route as property name
            htmlOutput[routes[i]] = this.minifyHtml(output);
        }

        return htmlOutput;
    },


    // Add dialogs to html
    addDialogs: function (html, dialogs) {
        for (var i = 0; i < dialogs.length; i++) {
            var dialogName = "dialog_" + path.parse(dialogs[i]).name;
            var dialogHtml = fs.readFileSync(dialogs[i], "utf-8");
            html[dialogName] = this.minifyHtml(dialogHtml);
        }

        return html;
    },


    // Minify html
    minifyHtml: function (html) {
        return minify(html, {
            removeComments: false,
            collapseWhitespace: false // comment out for ejs debugging, easier to read errors
        });
    },

}
