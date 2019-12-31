var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport({
	"host": config.email.host,
	"secureConnection": true,
	"port": 465,
	"auth":{
		"user": config.email.user,
		"pass": config.email.pass
	}
})

exports.sendCode = function(mail, code, callback){
	var mailOptions = {
		"from": config.email.user,
		"to": mail,
		"subject": "验证码",
		"html": code,
	}

	transport.sendMail(mailOptions, callback)
}

exports.sendEnclosure = function(mail, path, callback) {
	var mailOptions = {
		"from": config.email.user,
		"to": mail,
		"subject": "数据库备份",
		attachments: [ {path: path} ]
	}
	transport.sendMail(mailOptions, callback)
}

