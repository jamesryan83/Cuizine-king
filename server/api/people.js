"use strict";

// People api

var appDB = require("../procedures/_App");


exports = module.exports = {


    router: null,

    mail: require("../other/mail"), // is here for testing


    init: function (router) {
        this.router = router;
    },


    // Returns a perosn for the account page
    getPerson: function (req, res) {
        var self = this;

        // TODO : get person
        res.send({ person: "abc" });
    },


    // Delete a user
    deletePerson: function (req, res) {
        var self = this;
        var person = res.locals.person;

        if (!person) {
            return this.router.sendJson(res, null, "Not Authorized", 401);
        }

        var jwt = res.locals.person.jwt;
        var id_person = res.locals.person.id_person;

        // delete user
        appDB.people_delete({ jwt: jwt, id_person: id_person }, function (err, result) {
            if (err) return self.router.sendJson(res, null, err.message, err.status);

            return self.router.sendJson(res, result);
        });
    },

}
