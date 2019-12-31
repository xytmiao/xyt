module.exports = {
	"defaultRoot": {
		"username": "r123456", // 默认超级用户账号
		"password": "12345678" // 默认超级用户密码
	},
	"teacher": {
		"password": "12345678" // 教师默认密码
	},
	"db": {
		"storePwd": "ecustcmp", // 数据库备份压缩包密码
		"storeEmail": "691924095@qq.com", // 默认发送邮件
	},
	"email": {
		"host": "smtp.qq.com", // 邮件服务器主机
		"user": "ecust.competition@foxmail.com", // 邮箱
		"pass": "dnzgzbfnrefpfjcb" // 邮箱授权码
	},
	"studentSchema": {
	    "username": String,
		"password": String,
		"name": String,
		"born": Date,
		"gender": Number, // 0-男 1-女
		"idcard": String,
		"phone": String,
		"email": String,
		"isGraduate": Number, // 0-本科生 1-研究生
		"institute": String,
		"major": String,
		"class": String,
	}
}