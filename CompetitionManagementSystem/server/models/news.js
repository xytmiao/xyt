var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
// require("./db.js");

// 新闻
var newsSchema = new mongoose.Schema({
    "title": String,
    "date": {type: Date, default: ()=> new Date()},
	"content": String,
	"enclosure": [String],
}, { versionKey: false });

// 展示所有新闻
newsSchema.statics.all = function(callback){
	News.find().sort({"date": -1}).exec(callback);
}

// 展示某个新闻
newsSchema.statics.findById = function(_id, callback){
	News.findOne({"_id": new mongoose.Types.ObjectId(_id)},callback);
}

// 发布新闻
newsSchema.statics.add = function(obj, files, callback){
	var news = new News(obj);
	var id = news._id;
	fs.mkdirSync("./enclosure/" + id);
	files.forEach(file => {
		var showPath = "/" + id + "/" + file.originalname;
		news.enclosure.push(showPath);
		var oldPath = path.resolve("./uploads/" + file.originalname);
		var newPath = path.resolve("./enclosure" + showPath);
		fs.renameSync(oldPath, newPath);
	})
	news.save(function(err){
		if(err) callback(err, null);
		else callback(null, "success");
	});
}

newsSchema.statics.deleteById = function(id, callback){
	News.deleteOne({"_id": new mongoose.Types.ObjectId(id)}, callback);
	var p = "./enclosure/" + id;
	fs.readdirSync(p).forEach(function(file) {
	     fs.unlinkSync(p + '/' + file);
	})
	fs.rmdirSync(p);
}

newsSchema.statics.editById = function(id, data, files, callback) {
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
	News.updateOne({_id: new mongoose.Types.ObjectId(id)}, data, callback);
}

var News = mongoose.model("News", newsSchema);

module.exports = News;
