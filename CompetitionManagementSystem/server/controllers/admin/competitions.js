var Competition = require("../../models/competition.js");
var sd = require("silly-datetime");

module.exports = function(req, res) {
    Competition.all(function(err, cs) {
        if (err) {
            res.send("error");
            throw err;
            return;
        }
        res.send(cs.map(c => ({
            id: c._id,
            title: c.name,
            date: sd.format(c.date, 'YYYY-MM-DD'),
        })))
    })
}