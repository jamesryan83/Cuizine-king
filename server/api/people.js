"use strict";

// People api

var dbApp = require("../procedures/_App");


exports = module.exports = {

    router: null,


    init: function (router) {
        this.router = router;
    },


    // Get person
    get: function (req, res) {
        var self = this;
        var b = req.body;

        if (this.router.validateInputs(req, res, b, global.validationRules.peopleCreate))
            return;

        dbApp.people_get_by_id_or_email(b, function (err, person) {
            if (err) return self.router.sendJson(res, null, err.message);

            return self.router.sendJson(res, { person: person });
        });
    },

}
