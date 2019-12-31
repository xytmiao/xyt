function toTextarea(str) { //与下面函数功能相反，暂时用不到
    var reg = new RegExp("<br>", "g");
    var regSpace = new RegExp("&nbsp;", "g");
    str = str.replace(reg, "\n");
    str = str.replace(regSpace, " ");
    return str;
}

function textareaTo(str) { //将textarea内容中的空格和换行，转换为HTML格式，避免存入数据库时丢失
    var reg = new RegExp("\n", "g");
    var regSpace = new RegExp(" ", "g");
    str = str.replace(reg, "<br>");
    str = str.replace(regSpace, "&nbsp;");
    return str;
}