var CronJob = require('cron').CronJob;
var sd = require('silly-datetime');
var exec = require('child_process').execSync;
var email = require('./email.js');

// 每周一早上6点执行
new CronJob('0 0 6 * * 1', function() {
  	var t = sd.format(Date.now(), 'YYYYMMDD');
	exec('mongodump -h localhost -d project -o ./mongodump/');
	exec('zip ./dump_zip/dump-' + t + '.zip ./mongodump/project/* -P' + config.db.storePwd);
	email.sendEnclosure(config.db.storeEmail, './dump_zip/dump-' + t + '.zip', function(err) {
		if (err) throw err;
	});
}, null, true, 'Asia/Chongqing');
