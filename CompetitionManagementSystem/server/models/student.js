var mongoose = require("mongoose");
var encode = require("./encode.js");
// mongoose.connect('mongodb://localhost/project', { useNewUrlParser: true });

//学生
var studentSchema = new mongoose.Schema(config.studentSchema, { versionKey: false });

// 学生注册
studentSchema.statics.register = function(obj, callback){
	obj.password = encode(obj.password);
	Student.create(obj, function(err){
		if(err) callback(err, null);
		else callback(null, "success");
	});
}

studentSchema.statics.gbPassword = function(u, p, callback){
	Student.updateOne({"username": u}, {$set: {"password": encode(p)}}, callback);
}

// 学生登录方法
studentSchema.statics.login = function(obj, callback){
	Student.findOne({"username": obj.username}, function(err, result){
		if(err){
			callback(err, null);
			return;
		}
    	if(!result){
    		callback(null, '用户不存在！');
    		return;
    	}
    	if(encode(obj.password) != result.password){
    		callback(null, "密码错误！");
    		return;
    	}
    	callback(null, "success");
    });
}

// 获取学生信息方法
studentSchema.statics.findById = function(username, callback){
	Student.findOne({"username": username}, callback);
}

// 更新学生信息
studentSchema.statics.upInfo = function(username, data, callback){
	Student.updateOne({"username": username}, data, callback); //回调函数必须要有，不然修改失败
}

// 获取学生年龄实例方法
studentSchema.methods.getAge = function() {
	if (!this.born) return 0;
	var d = new Date(),
		b = this.born,
		dy = d.getYear() - b.getYear(),
		bmd = b.getMonth() * 100 + b.getDate(),
		dmd = d.getMonth() * 100 + d.getDate(),
		age = dy + (dmd > bmd ? 0 : -1);
	return age;
}

// 获取该学生在那个时间时的年级
studentSchema.methods.getGrade = function(d) {
	s = this;
	if (!s.class) return '';
	var n = s.class.replace(/[^0-9]/ig,"").substr(0, 2), // 取数字的前2位
		d = new Date(),
		y = 100 + parseInt(n),
		g = d.getYear() - y + (d.getMonth() * 100 + d.getDate() > 801),
		grade = (s.isGraduate ? "研" : "大") + ["一", "二", "三", "四"][g - 1];
	return (g <= 4 && g > 0) ? grade : '';
}

var Student = mongoose.model("Student", studentSchema);

module.exports = Student;
