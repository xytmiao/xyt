var mongoose = require("mongoose");
var One = require("./one.js");
var Leader = require("./leader")

// 记录
var recordSchema = new mongoose.Schema({
	"father": {
		type: mongoose.Schema.ObjectId, // 竞赛id
		ref: 'One', // 关联One
	},
    "member": [{
    	"_id": false,
    	"username": String,
		"name": String,
		"age": Number, // 由学生的出生born计算
		"gender": Number,
		"idcard": String,
		"phone": String,
		"email": String,
		"institute": String,
		"major": String,
		"class": String,
		"grade": String, // 由学生班级计算得
    }],
    "recruit": {type: Boolean, default: false}, // 招募状态, true表示招募中
	"item": String, //项目名
	"category": String, // 参赛类别
	"introduction": String, // 该项目简介
	"condition": String,//项目招募条件
	"leader": [{
		type: mongoose.Schema.ObjectId, // 竞赛id
		ref: 'Leader', // 关联Leader
	}], 	
	"status": {type: Number, default: 0}, // 审核状态: 0-未审核, 1-已通过, 2-未通过
	"remark": String, // 审核后负责人留下的备注
	"prize": String, // 获奖情况
	"date": {type: Date, default: ()=> new Date()}, // 创建日期
	"lastDate": {type: Date, default: ()=> new Date()}, // 最后修改日期
}, { versionKey: false });

recordSchema.statics.findById = function(_id, callback){
	Record.findOne({"_id": new mongoose.Types.ObjectId(_id)}).populate("father").exec(callback);
}

recordSchema.statics.findByFather = function(father, callback){
	Record.find({"father": new mongoose.Types.ObjectId(father)}).sort({"_id": -1}).exec(callback);
}

recordSchema.statics.findByStudent = function(student, callback){
	Record.find({"member.username": student}).sort({"_id": -1}).populate("father").exec(callback);
}

// 学生删除比赛报名
recordSchema.statics.deleteById = function(_id, callback){
	Record.deleteOne({"_id": new mongoose.Types.ObjectId(_id)}, callback);
}

// 报名比赛
recordSchema.statics.add = function(father, team, callback){
	var record = new Record(team);
	record.father = new mongoose.Types.ObjectId(father);
	One.findOne({"_id": record.father}, function(err, one){
		if(err){
			callback(err, null);
			return;
		}
		record.save(callback);
	})
}

// 修改比赛报名信息/审核比赛
recordSchema.statics.edit = function(_id, data, callback){
	data.lastDate = new Date();
	Record.updateOne({"_id": new mongoose.Types.ObjectId(_id)}, data, callback);
}



var Record = mongoose.model("Record", recordSchema);

module.exports = Record;