//功能函数

/*
*isChinese(str)：判断是否是中文
*mailFormat(str)：判断邮箱格式
*
*
 */


exports.isChinese = function(str) {
    var reg=/[\u4E00-\u9FA5]/i;   
    return reg.test(str);     
}

exports.mailFormat = function(str) {
    var reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;   
    return reg.test(str);     
}
