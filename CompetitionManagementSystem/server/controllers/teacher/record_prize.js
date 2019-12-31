var Record = require("../../models/record.js");
var async = require("async");

module.exports = function(req, res){
	/*
	datas = {
		datas: [{
			"prize": "一等奖",
			"record": ["record.id"]
		}]}
	*/
	var datas = req.body.datas;
	var tasks = [];
	datas.forEach(function(data, i) {
		tasks.push(function(callback) {
			Record.updateMany({"_id": data.record}, {"prize": data.prize}, function(err) {
				if (err) callback(err);
				else callback(null);
			})
		});
	})
	async.waterfall(tasks, function(err) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}