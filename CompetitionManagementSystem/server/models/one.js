var mongoose = require("mongoose");
var Competition = require("./competition.js");
// mongoose.connect('mongodb://localhost/project', { useNewUrlParser: true });

// 某个具体可报名的竞赛
var oneSchema = new mongoose.Schema({
	"father": {
		type: mongoose.Schema.ObjectId,
		ref: 'Competition'
	},
	"version": String,
	"dimension": String, // 比赛规模，如校赛、省赛
	"introduction": String,
	"category": [{
		"_id": false,
		"name": String, // 竞赛类别
		"max": Number, // 最大报名人数
	}],
	"begin": Date,
	"end": Date,
	"prizeDate": Date, // 颁奖日期
	"date": {type: Date, default: ()=> new Date()},
}, { versionKey: false });

// 添加一个用于报名的竞赛
oneSchema.statics.add = function(fa, obj, callback){
	var father = new mongoose.Types.ObjectId(fa);
	Competition.findOne({"_id": father}, function(err, c){
		if(err){
			callback(err);
			return;
		}
		obj.begin = new Date(obj.begin);
		obj.end = new Date(obj.end);
		obj.father = father;
		var one = new One(obj);
		one.save(function(err){
			if(err){
				callback(err);
				return;
			}
			c.latest = one._id;
			c.save(function(err){
				if(err){
					callback(err);
					return;
				}
				callback(null);
			});
		});
	})
}

oneSchema.statics.findByFather = function(_id, callback){
	var father = new mongoose.Types.ObjectId(_id);
	One.find({"father": father}).sort({"_id": -1}).exec(callback);
}

oneSchema.statics.findById = function(_id, callback){
	One.findOne({"_id": new mongoose.Types.ObjectId(_id)}, callback);
}

oneSchema.statics.findByTeacher = function(t, callback) {
	One.find({"teacher": t}).sort({"_id": -1}).exec(callback);
}

oneSchema.statics.editById = function(_id, data, callback){
	One.updateOne({"_id": new mongoose.Types.ObjectId(_id)}, data, callback);
}

var One = mongoose.model("One", oneSchema);
module.exports = One;
