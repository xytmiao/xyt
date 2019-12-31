var One = require("../../models/one.js");
var Competition = require("../../models/competition.js");

module.exports = function(req, res, cid) {
    Competition.findById(cid, function(err, c) {
        if (err) {
            res.send("error");
            throw err;
            return;
        }
        One.updateOne({ "_id": c.latest }, { "prizeDate": req.query.prizeDate }, function(err) {
                if (err) {
                    res.send("error");
                    throw err;
                    return;
                }
                res.send("success");
        })
    })
}