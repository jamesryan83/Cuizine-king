
## Code style notes

Don't use style="" in html.  Except for style="display: none" on big things (loading screen etc.)
    and things where it's important for them to be hidden if the css doesn't load

Don't use semantic html elements.  Makes things a bit easier

Be careful with naming things.  Id's should be very specific especially on bigger pages

Don't use default parameters in sql store procedure inputs.  Mssql seems to provide default values that override them

Any images used for testing should be funny



## Design patterns

Node

    // something.js

    "use strict";

    exports = module.exports = {

        doSomething: function (text) {
            console.log(text);
        },

        getSomething: function () {
            return "blah 2";
        },
    }

    // in another file
    var something = require("path/to/something");
    something.doSomething("blah 1");


Client

    "use strict";
    var app = app || {};

    app.something = {

        // startup function
        init: function () {
            this.doSomething("blah 1");
        },

        doSomething: function (text) {
            console.log(text);
        },

        doSomethingElse: function () {
            console.log("blah 2");
        },
    }

    // call start function
    app.something.init();



## How the server works

The node server doesn't start listening until after the database and session store
    are connected.  After that it just processes requests until it crashes



## How pages work on the website

The routes are setup in the init function of other/router.js when the server
    is started.  router.init is called from server.js

The page routes are in www/js/cms.js and www/js/site.js.  Theses are in the
    client-side files because it's required on cordova.
    These lists are passed into router.get() when the router starts up and
    if any one of these routes is called it calls renderpage with the section
    of the site the page is in.  The sections are either site, cms or sysadmin

        router.get(routerSite.routesList, function (req, res) { self.renderPage(req, res, "site"); });


When a request for /help comes in it goes to other/router.js into the above
    function and then renderPage in other/router.js is called.

renderPage gets the data and html for the page.  The data
    comes from the client side router and the html comes from the generated html json file
    The data is just basic stuff to load the page.  Most of the data comes from the api
    after a page is loaded

The page is rendered with the data and sent to the client.  There are multiple
    html index files, one is sent to the client depending on the section of the site



## How pages work on cordova
    sort of the same as above

    TODO


## Database

All the database SQL code is in server/sql

The seed data is generated in the excel workbook in the fakedata folder

## Testing

    TODO

## Client js

    TODO



## Fake data

There are descriptions in each of the fake data generation js files of what's there
But this is just a folder for all the test data that's used for website dev, pretty much all database data




