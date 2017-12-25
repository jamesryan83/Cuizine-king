"use strict";

var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var minify = require('html-minifier').minify;
var recursiveReadSync = require("recursive-readdir-sync");

var config = require("../config");

var wwwFolder = path.join(__dirname, "../", "../", "www");


exports = module.exports = {

    htmlFilePaths: null,
    htmlInputsPath: null,


    start: function () {
        this.htmlInputsPath = path.join(wwwFolder, "html");
        var outputsPath = path.join(wwwFolder, "generated");

        this.htmlFilePaths = recursiveReadSync(this.htmlInputsPath)

        // create json files with html pages
        var clientRouter = require("../../www/js/shared/client-router");

        var htmlOutputLoggedOut = this.compileHtmlList(
            clientRouter.loggedOutRoutesList, clientRouter.loggedOutRoutes);

        var htmlOutputLoggedIn = this.compileHtmlList(
            clientRouter.loggedInRoutesList, clientRouter.loggedInRoutes);

        fs.writeFileSync(path.join(outputsPath, "logged-out.json"), JSON.stringify(htmlOutputLoggedOut));
        fs.writeFileSync(path.join(outputsPath, "logged-in.json"), JSON.stringify(htmlOutputLoggedIn));


        // create cordova and website index pages
        var indexHtml = fs.readFileSync(path.join(wwwFolder, "html", "index.html"), "utf-8");

        fs.writeFileSync(path.join(wwwFolder, "index-cordova.html"),
            ejs.compile(indexHtml, { delimiter: "?" })({ isCordova: true }));
        fs.writeFileSync(path.join(wwwFolder, "index-website.html"),
            ejs.compile(indexHtml, { delimiter: "?" })({ isCordova: false }));
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
    compileHtmlList: function (clientRouter, dataList) {
        var htmlOutput = {};

        // for each route
        for (var i = 0; i < clientRouter.length; i++) {
            var pageData = dataList[clientRouter[i]];

            // ignore some pages
            if (Object.keys(pageData).length === 0) continue;
            if (!pageData.file) continue;

            pageData.isCordova = config.isCordova;

            var output = this.compileHtml(this.htmlFilePaths.filter(function (filePath) {
                return path.parse(filePath).name == pageData.file;
            })[0], pageData);

            // add html to output object with route as property name
            htmlOutput[clientRouter[i]] = minify(output, {
                removeComments: true,
                collapseWhitespace: true // comment out for ejs debugging, easier to read errors
            });
        }

        return htmlOutput;
    }

}