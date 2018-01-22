// Generate jwts from the command line
// usage: node util-jwt

var jwt = require("jsonwebtoken");
var config = require("../config");

jwt.sign({ email: "james4165@hotmail.com" }, config.secret, { expiresIn: config.jwtExpiryLong }, function (err, jwToken) {
    console.log(jwToken);
});
