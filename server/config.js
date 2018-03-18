
// Base config settings
var config = {

    // General stuff
    "host": "",
    "port": 1337,
    "secret": "tfwyoucantthinkofasecret",
    "jwtExpiryShort": 300000, // 5 minutes
    "jwtExpiryLong": "7d",  // 2s 2m 2h 2d
    "storeLogos": "/res/storelogos/",
    "supportedLanguages": ["en", "zh"],
    "minifyjs": false,
    "isCordova": false,
    "showLogPaths": true,
    "logSQLerrors": true,
    "logRequestRoute": true,
    "logRequestHeaders": false,
    "clearConsoleOnRestart": true,


    // EMail
    "mail": {
        "serverEmail": "jamesryan4171@gmail.com",
        "apikey": "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"
    },


    // Database
    "mssql": {
        "user": "",
        "password": "",
        "server": "",
        "database": "menuthing",
        "pool": {
            "max": 10,
            "min": 0,
            "idleTimeoutMillis": 30000
        },
        "options": {
            "encrypt": false,
            "useUTC": true,
            "connectTimeout": 15000,
            "requestTimeout": 15000,
            "cancelTimeout": 5000
        }
    },


    // Azure blob storage
    "blobStorage": {
        "host": "http://127.0.0.1:10000/devstoreaccount1",
        "hostDev": "http://127.0.0.1:10000/devstoreaccount1",
    },


    // Database constants
    "dbConstants": {
        "orderTypes": {
            "delivery": 1,
            "dinein": 2,
            "takeaway": 3
        },
        "paymentMethods": {
            "creditcard": 1,
            "cash": 2,
            "paypal": 3
        },
        "adminUsers": {
            "website": 1,
            "store": 2,
            "system": 3
        },
        "adminStore": 1
    }
}


// Production settings
if (process.env.NODE_ENV === "production") {
    config.host = "http://menuthing.azurewebsites.net";
    config.mssql.user = "james";
    config.mssql.password = "Budza123";
    config.mssql.server = "sqljames.database.windows.net";
    config.mssql.options.encrypt = true;

 // Dev settings
} else { // James
  config.host = "http://localhost:" + config.port
  config.mssql.user = "sa";
  config.mssql.password = "budza123";
  config.mssql.server = "localhost";
}

// } else { // User 2
//   config.host = "http://localhost" + ":" + config.port
//   config.mssql.user = "sa";
//   config.mssql.password = "my_password";
//   config.mssql.server = "localhost";
// }


exports = module.exports = config;
