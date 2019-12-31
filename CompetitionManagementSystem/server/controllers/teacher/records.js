var Record = require("../../models/record.js");
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
        Record.find({ "father": id, "status": [0, 1] }, function(err, rs) {
            if (err) {
                res.send("error");
                throw err;
                return;
            }
            var data = [];
            (function it(i) {
                if (i == rs.length) {
                    res.json({
                        attend: c.attend,
                        records: data
                    });
                    return;
                }
                if (rs[i].status != 1) {
                    Student.findById(rs[i].member[0].username, function(err, s) {
                        if (err) {
                            res.send("error");
                            throw err;
                            return;
                        }
                        data.push({
                            category: rs[i].category,
                            item: rs[i].item,
                            captain: s.name,
                            status: rs[i].status,
                            id: rs[i]._id
                        })
                        it(i + 1);
                    })
                } else {
                    data.push({
                        category: rs[i].category,
                        item: rs[i].item,
                        captain: rs[i].member[0].name,
                        status: rs[i].status,
                        id: rs[i]._id
                    })
                    it(i + 1);
                }
            })(0);
        })
    })
}