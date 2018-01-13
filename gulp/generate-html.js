"use strict";

var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var minify = require('html-minifier').minify;
var recursiveReadSync = require("recursive-readdir-sync");

var config = require("../server/config");

var wwwFolder = path.join(__dirname, "../", "www");
var htmlFolder = path.join(__dirname, "../", "www", "html");


exports = module.exports = {

    htmlFilePaths: null,
    htmlInputsPath: null,


    // Start
    start: function () {
        var outputsPath = path.join(wwwFolder, "generated");

        this.htmlFilePaths = recursiveReadSync(htmlFolder);

        // create json files with html pages
        var cmsRouter = require("../www/js/cms");
        var siteRouter = require("../www/js/site");
        var sysadminRouter = require("../www/js/sysadmin");

        var htmlOutputCms = this.compileHtmlList(
            cmsRouter.routesList, cmsRouter.routes);

        var htmlOutputSite = this.compileHtmlList(
            siteRouter.routesList, siteRouter.routes);

        var htmlOutputSysadmin = this.compileHtmlList(
            sysadminRouter.routesList, sysadminRouter.routes);

        fs.writeFileSync(path.join(outputsPath, "_cms.json"), JSON.stringify(htmlOutputCms));
        fs.writeFileSync(path.join(outputsPath, "_site.json"), JSON.stringify(htmlOutputSite));
        fs.writeFileSync(path.join(outputsPath, "_sysadmin.json"), JSON.stringify(htmlOutputSysadmin));


        // index files
        this.compileIndexFile("cms.html", "_index-cms.html");
        this.compileIndexFile("site.html", "_index-site.html");
        this.compileIndexFile("sysadmin.html", "_index-sysadmin.html");
        this.compileIndexFile("cordova.html", "_index-cordova.html");
    },



    // Compile single html page
    compileHtml: function (htmlFilePath, data) {
        var self = this;

        var html = fs.readFileSync(htmlFilePath, "utf8");
        var compiledHtml = ejs.compile(html, { client: true, delimiter: "?" });

        // the callback here is fired for each include found
        return compiledHtml(data, null, function (include, otherData) {
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
            htmlOutput[routes[i]] = minify(output, {
                removeComments: true,
                collapseWhitespace: true // comment out for ejs debugging, easier to read errors
            });
        }

        return htmlOutput;
    },


    // Compiles an index file
    compileIndexFile: function (inputFileName, outputFileName) {
        fs.writeFileSync(path.join(wwwFolder, outputFileName),
            this.compileHtml(path.join(htmlFolder, inputFileName)));
    },

}