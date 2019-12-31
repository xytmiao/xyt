var mongoose = require("mongoose");

// 竞赛
var competitionSchema = new mongoose.Schema({
    "no": Number, // 用于竞赛列别的排序
    "name": String,
    "teacher": String,
    "attend": { type: Number, default: 1 }, // 1-多人 0-单人
    "isGraduate": Number, //本科生/研究生
    "level": Number, //一二三级 1, 2, 3
    "class": Number, // 0-a类 1-b类 2-c类
    "rank": String, // 国家级，校级。。。
    "sponsor": String,
    "type": String, //竞赛的类别
    "latest": mongoose.Schema.ObjectId, // one id
    "date": { type: Date, default: () => new Date() }, // 创建日期
    "lastDate": { type: Date, default: () => new Date() }, // 最后修改日期
    "hide": {type: Boolean, default: false}
}, { versionKey: false });

// 展示所有竞赛
competitionSchema.statics.all = function(callback) {
    Competition.find({"hide": false}).sort({ "no": 1}).exec(callback);
}

// 展示某个负责人的比赛
competitionSchema.statics.findByTeacher = function(username, callback) {
    Competition.find({ "teacher": username, "hide": false }).sort({ "no": 1 }).exec(callback);
}

// 找到某个竞赛
competitionSchema.statics.findById = function(_id, callback) {
    Competition.findOne({ "_id": new mongoose.Types.ObjectId(_id) }, callback);
}

// 添加竞赛
competitionSchema.statics.add = function(body, callback) {
    Competition.find()
        .sort({ no: 1 })
        .exec(function(err, cs) {
            if (err) {
                callback(err, null);
                return;
            }
            var flag = false;
            body.no = cs.length;
            for (var i = 0; i < cs.length; i++) {
                if (body.isGraduate == cs[i].isGraduate && body.level == cs[i].level && body.class == cs[i].class) {
                    flag = true;
                } else if (flag) {
                    body.no = (cs[i - 1].no + cs[i].no) / 2;
                    break;
                }
            }
            Competition.create(body, callback);
        })

}

// 编辑竞赛
competitionSchema.statics.editById = function(id, body, callback) {
    body.date = new Date();
    Competition.updateOne({ "_id": new mongoose.Types.ObjectId(id) }, body, callback);
}

//删除竞赛
competitionSchema.statics.deleteById = function(id, callback) {
    Competition.updateOne({ "_id": new mongoose.Types.ObjectId(id) }, { "hide": true },callback);
}

var Competition = mongoose.model("Competition", competitionSchema);

module.exports = Competition;