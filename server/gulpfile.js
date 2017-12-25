"use strict";

var gulp = require("gulp");
var path = require("path");
var sass = require("gulp-sass");
var watch = require("gulp-watch");
var autoprefixer = require("gulp-autoprefixer");

var generateHtml = require("./gulp/generate-html.js");
var generateJs = require("./gulp/generate-js.js");
var generateSqlCreate = require("./gulp/generate-sql-create.js");
var generateSqlJs = require("./gulp/generate-sql-js.js");


var scssInputsPath = path.join(__dirname, "../", "www", "scss", "**", "*.scss");
var outputsPath = path.join(__dirname, "../", "www", "generated");


// watch all
gulp.task("default", function () {
    gulp.watch(path.join(__dirname, "../", "www", "html", "**", "*.html"), ["html"]);
    gulp.watch(scssInputsPath, ["scss"]);
    gulp.watch(path.join(__dirname, "../", "www", "js", "**", "*.js"), ["js"]);
    gulp.watch(path.join(__dirname, "sql", "other", "**", "*.sql"), ["sql", "sqljs"]);
    gulp.watch(path.join(__dirname, "sql", "procedures", "**", "*.sql"), ["sql", "sqljs"]);
    gulp.watch(path.join(__dirname, "sql", "tables", "**", "*.sql"), ["sql", "sqljs"]);
});


// run all once
gulp.task("all", ["scss", "js", "html", "sql", "sqljs"]);



gulp.task("html", function () {
    generateHtml.start();
});


gulp.task("scss", function () {
    return gulp.src(scssInputsPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["> 5%"],
            cascade: false
        }))
        .pipe(gulp.dest(outputsPath));
});


gulp.task("js", function () {
    generateJs.start();
});


gulp.task("sql", function () {
    generateSqlCreate.start();
});


gulp.task("sqljs", function () {
    generateSqlJs.start();
});

