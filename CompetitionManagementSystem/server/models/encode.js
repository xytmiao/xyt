var crypto = require('crypto');

var md5 = (v) => crypto.createHash('md5').update(v).digest('hex');

function encode(src){
	var r1 = md5(src);
	var l = "", r = "";
	for(var i = 0; i < r1.length; i++){
		if(i % 2) r += r1[i];
		else l += r1[i];
	}
	var r2 = md5(l + r);
	return r2;
}

module.exports = encode;
