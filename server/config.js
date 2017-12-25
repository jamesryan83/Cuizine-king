
// Base config settings
var config = {
    "isCordova": false,
    "title": "menuthing",
    "host": "",
    "port": 1337,
    "secret": "fallout3isprettygood",
    "jwtExpiry": "1y", // 2s 2h 2d
    "showLogPaths": true,
    "logSQLerrors": true,
    "logRequestRoute": true,
    "logRequestHeaders": false,

    "mail": {
        "serverEmail": "no-reply@menuthing.com",
        "apikey": "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"
    },

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
} else {
  config.host = "http://localhost" + ":" + config.port
  config.mssql.user = "sa";
  config.mssql.password = "budza123";
  config.mssql.server = "localhost";
}

exports = module.exports = config;
