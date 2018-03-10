"use strict";

var gulp = require("gulp");
var path = require("path");
var sass = require("gulp-sass");
// var watch = require("gulp-watch");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");

var generateHtml = require("./generate-html.js");
var generateJs = require("./generate-js.js");
var generateSqlCreate = require("./generate-sql-create.js");
var generateSqlJs = require("./generate-sql-js.js");


var scssInputsPath = path.join(__dirname, "../", "www", "scss", "**", "*.scss");


// watch all
gulp.task("default", function () {
    gulp.watch(path.join(__dirname, "../", "www", "html", "**", "*.html"), { interval: 500 }, ["html"]);
    gulp.watch(scssInputsPath, { interval: 500 }, ["scss"]);
    gulp.watch(path.join(__dirname, "../", "www", "js", "**", "*.js"), { interval: 500 }, ["js"]);
    gulp.watch(path.join(__dirname, "../", "sql", "other", "**", "*.sql"), { interval: 500 }, ["sql", "sqljs"]);
    gulp.watch(path.join(__dirname, "../", "sql", "procedures", "**", "*.sql"), { interval: 500 }, ["sql", "sqljs"]);
    gulp.watch(path.join(__dirname, "../", "sql", "tables", "**", "*.sql"), { interval: 500 }, ["sql", "sqljs"]);
});


// run all once
gulp.task("all", ["scss", "js", "html", "sql", "sqljs"]);



gulp.task("html", function () {
    generateHtml.start();
});


gulp.task("scss", function () {
    return gulp.src(scssInputsPath)
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["> 5%"],
            cascade: false
        }))
        .pipe(rename({ prefix: "_" }))
        .pipe(gulp.dest(path.join(__dirname, "../", "www", "generated")));
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
