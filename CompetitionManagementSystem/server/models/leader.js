var mongoose = require("mongoose");

// 导师
var leaderSchema = new mongoose.Schema({
    "username": String,
    "name": String,
    "gender": Number,
    "idcard": String,
    "phone": String,
    "email": String,
	"institute": String,
	"department": String,
	"job": String,
}, { versionKey: false });

leaderSchema.statics.findById = function(u, callback) {
    Leader.findOne({"username": u}, callback);
}

leaderSchema.statics.add = function(l, callback) {
	Leader.findOne({"username": l.username}, (err, ol) => {
		if (err) {
			callback(err);
			return;
		}
		if (!ol) { // 不存在则创建
			Leader.create(l, (err, nl) => {
				if (err) {
					callback(err, nl);
					return;
				}
				callback(null, nl);
			});
		} else { // 存在则更新
			for (var attr in l) {
				ol[attr] = l[attr];
			}
			ol.save((err, nl) => {
				if (err) {
					callback(err, nl);
					return;
				}
				callback(null, nl);
			})
		}
	})
}

var Leader = mongoose.model("Leader", leaderSchema);
module.exports = Leader;
