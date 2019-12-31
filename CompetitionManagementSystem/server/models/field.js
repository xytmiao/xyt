var mongoose = require("mongoose");
var encode = require("./encode.js");

// 统计字段历史记录
var fieldSchema = new mongoose.Schema({
    "father": String, // 负责人、管理员账号
	"field": [String],
}, { versionKey: false });

fieldSchema.statics.add = function(fa, field, callback) {
    field.create({"father": fa, "field": field}, callback);
}

fieldSchema.statics.findByFather = function(fa, callback) {
    filed.find({father: fa}).sort({"_id": -1}).exec(callback);
}

var Field = mongoose.model("Field", fieldSchema);
module.exports = Field;
