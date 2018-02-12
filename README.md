
## Various Accounts


** Sendgrid (Email service) **
    un: appmakin
    pw: Summer2017
    apikey (saas1): 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
    some other username: azure_a9ba7dec061269d4c607af76306fc99b@azure.com

my gmail account is currently the main test account.  There's a trick that lets you
have multiple email addresses per single gmail account
http://www.techverse.net/create-multiple-custom-email-address-one-gmail-account/


** MSSQL Database **
Local
    host: http://localhost:port
    un: sa
    pw: your password

Azure
    host: http://menuthing.azurewebsites.net


** Git **
    un: Menuthing
    pw: Menuthing




## Project setup

install nodemon globally (https://github.com/remy/nodemon) [npm i -g nodemon]
install mocha globally (https://github.com/mochajs/mocha) [npm i -g mocha]


1. Run 'gulp' in the /gulp folder in a seperate command window
        This will watch the /www and /sql folders for changes and
        compile the html/scss/js/sql files into the www/generated folder

2. Run /sql/batchfiles/db-create-empty.bat

3. Update the Dev Settings section at the bottom of in server/config.js with the
    details of your local database
    user = "sa" usually for localhost, server = localhost

4. in a command window in the root folder (the one with package.json)
    npm install

5. in a command window in the /website folder run
	nodemon server.js

6. visit localhost:1337 in a browser


Tests can be run by:
    1. Run /sql/batchfiles/test-db-create-empty.bat
    2. Start the server using steps above
    3. run 'node test-start.js' in a command window in the /tests folder




## Updating the azure database

1. In SSMS, right click the azure database and select New Query.  Then paste in
    the code from /sql/generated/_drop-all.sql and run it.

2. Run /sql/batchfiles/azure-db-recreate-empty.bat (takes a few minutes to run)




## Updating the azure website

Push the code to git and the website is restarted and updated automatically




## Node packages

Which node packages are for which part of the code:

General server stuff
    sendgrid, body-parser, ejs, express, multer, request-ip, validate.js

Database
    azure-storage, mssql

Auth
    bcryptjs, jsonwebtoken, passport, passport-jwt

Security
    helmet, hpp

Gulp
    gulp, gulp-autoprefixer, gulp-rename, gulp-sass, gulp-watch,
    html-minifier, recursive-readdir-sync, uglify-js

Testing
    mocha, supertest





## Other Notes

Azure handles the following things:
    - restarting the server when it stops
    - clustering (from nodeProcessCountPerApplication in IISNode.yml)
    - logging
    - some security headers
    - compression

    https://tomasz.janczuk.org/2011/08/hosting-nodejs-applications-in-iis-on.html
    https://tomasz.janczuk.org/2011/10/architecture-of-iisnode.html





## Cordova

was having this issue here with latest android studio: https://stackoverflow.com/a/43049089

use this tools folder instead
https://www.techspot.com/downloads/5425-android-sdk.html

and set these environment variables
http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables

creating hardlink to www folder.  this is required for cordova to compile
mklink /J C:\Code\projects\appmakin\menuthing\app\www C:\Code\projects\appmakin\menuthing\www



## Code style notes

Don't use style="" in html if possible.  Except for style="display: none" on big things (loading screen etc.)
    and things where it's important for them to be hidden if the css doesn't load

Don't use semantic html elements.  Makes things a bit easier



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
    var thing = something.getSomething();


Client

    // something.js
    // note: "use strict and var app = app || {}; are
    // added by gulp when the js files are joined together

    app.something = {

        // startup function
        init: function () {
            this.doSomething("blah 1");
        },

        doSomething: function (text) {
            console.log(text);
        },
    }

    // call function from anywhere in client javascript
    app.something.init();



## Other things

might come up later under load
https://github.com/tjanczuk/iisnode/issues/456

require path ideas
https://gist.github.com/branneman/8048520
