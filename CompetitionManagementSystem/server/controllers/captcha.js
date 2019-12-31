var svgCaptcha = require('svg-captcha');

function getCaptcha(){
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '01ilI', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44,
        background: '#ffffff'
    }
    var captcha = svgCaptcha.create(codeConfig);
    return(captcha);
}

module.exports = function(req, res){
	var c = getCaptcha();
	req.session.captcha = c.text.toLowerCase();
	var codeData = {
		img: c.data,
	}
	res.json(codeData);
}