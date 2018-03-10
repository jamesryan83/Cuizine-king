"use strict";

// People api

var appDB = require("../procedures/_App");


exports = module.exports = {


    router: null,

    mail: require("../other/mail"), // is here for testing


    init: function (router) {
        this.router = router;
    },


    // Returns a person for the account page
    getPerson: function (req, res) {

        // TODO : get person
        res.send({ person: "abc" });
    },


    // Delete a user
    deletePerson: function (req, res) {
        var self = this;
        var person = res.locals.person;

        if (!person) {
            return this.router.sendJson(req, res, null, {
                message: "notAuthorized", status: 401 });
        }

        var jwt = res.locals.person.jwt;
        var id_person = res.locals.person.id_person;

        // delete user
        appDB.people_delete({ jwt: jwt, id_person: id_person }, function (err) {
            if (err) return self.router.sendJson(req, res, null, err);

            return self.router.sendJson(req, res, result);
        });
    },

}
