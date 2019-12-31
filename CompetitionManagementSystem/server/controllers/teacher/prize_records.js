var Record = require("../../models/record.js");
var One = require("../../models/one.js");
var Student = require("../../models/student.js");
var Competition = require("../../models/competition.js");

module.exports = function(req, res, cid) {
    Competition.findById(cid, function(err, c) {
        if (err) {
            res.send("error");
            throw err;
            return;
        }
        var id = c.latest;
        One.findById(id, function(err, o) {
            if (err) {
                res.send("error");
                throw err;
                return;
            }
            Record.find({ "father": id, "status": 1 }, function(err, rs) {
                if (err) {
                    res.send("error");
                    throw err;
                    return;
                }
                var data = rs.map(r => ({
                    category: r.category,
                    item: r.item,
                    captain: r.member[0].name,
                    prize: r.prize,
                    id: r._id
                }))
                res.json({
                    attend: c.attend,
                    prizeDate: o.prizeDate,
                    records: data
                })
            })
        })
    })
}