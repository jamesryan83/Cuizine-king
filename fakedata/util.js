// Generate jwts from the command line
// usage: node util-jwt

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var config = require("../server/config");

jwt.sign({ sub: "james4171@hotmail.com", shortExp: config.jwtExpiryShort }, config.secret, { expiresIn: "10y" }, function (err, jwToken) {
    console.log(jwToken);
});


bcrypt.hash("password", 10, function (err, encryptedPassword) {
    console.log(encryptedPassword);
});
