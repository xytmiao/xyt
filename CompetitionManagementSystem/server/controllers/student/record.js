var Record = require("../../models/record.js");
var Competition = require("../../models/competition.js");

module.exports = function(req, res, rid) {
    Record.findOne({_id: rid})
        .populate("leader")
        .populate({
            path: "father",
            populate: { path: "father" },
        })
        // .populate("leader")
        .exec(function (err, r) {
            if (err) {
                res.send("error");
                throw err;
                return;
            }
            // 判断这条报名记录是不是这个学生应该看的，未完成判断学生是否在这个组里
            if (!r) {
                res.send("这不是你该做的！");
                return;
            }
            r = r.toJSON();
            r.canEdit = (r.father.end > new Date()) && (r.member[0].username == req.session.username);
            r.id = r._id;
            delete r._id;
            res.send(r);
        })
}
