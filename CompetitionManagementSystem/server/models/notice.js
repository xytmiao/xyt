var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");

// 某个竞赛的通知
var noticeSchema = new mongoose.Schema({
	"father": mongoose.Schema.ObjectId,
    "title": String,
    "date": {type: Date, default: ()=> new Date()},
	"content": String,
	"enclosure": [String],
}, { versionKey: false });

// 展示该竞赛下的所有通知
noticeSchema.statics.findByFather = function(father, callback){
	Notice.find({"father": new mongoose.Types.ObjectId(father)}).sort({"date": -1}).exec(callback);
}

// 通知详情
noticeSchema.statics.findById = function(_id, callback){
	Notice.findOne({"_id": new mongoose.Types.ObjectId(_id)}, callback);
}

// 发布通知
noticeSchema.statics.add = function(father, obj, files, callback){
	obj.father = new mongoose.Types.ObjectId(father);
	var notice = new Notice(obj);
	var id = notice.id
	fs.mkdirSync("./enclosure/" + id);
	files.forEach(file => {
		var showPath = "/" + id + "/" + file.originalname;
		notice.enclosure.push(showPath);
		var oldPath = path.resolve("./uploads/" + file.originalname);
		var newPath = path.resolve("./enclosure" + showPath);
		fs.renameSync(oldPath, newPath);
	})
	notice.save(function(err){
		if(err) callback(err, null);
		else callback(null, "success");
	});
}

noticeSchema.statics.deleteById = function(id, callback){
	Notice.deleteOne({"_id": new mongoose.Types.ObjectId(id)}, callback);
	var p = "./enclosure/" + id;
	fs.readdirSync(p).forEach(function(file) {
	     fs.unlinkSync(p + '/' + file);
	})
	fs.rmdirSync(p);
}

noticeSchema.statics.editById = function(id, data, files, callback) {
	var p = "./enclosure/" + id;
	var m = {};
	data.enclosure && data.enclosure.forEach(file => m[file] = true);
	fs.readdirSync(p).forEach(function(file) {
		m[file] || fs.unlinkSync(p + '/' + file);
	})
	data.enclosure ? data.enclosure = data.enclosure.map(file => "/" + id + "/" + file) : data.enclosure = [];
	files.forEach(function(file) {
		var showPath = "/" + id + "/" + file.originalname;
		var oldPath = path.resolve("./uploads/" + file.originalname);
		var newPath = path.resolve("./enclosure" + showPath);
		fs.renameSync(oldPath, newPath);
	})
	Notice.updateOne({_id: new mongoose.Types.ObjectId(id)}, data, callback);
}

var Notice = mongoose.model("Notice", noticeSchema);
module.exports = Notice;
