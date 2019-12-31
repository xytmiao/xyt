$(".main-header").html(
    '<a href="/" class="logo" style="">' +
    '<span class="logo-mini"><b>ECUST</b></span>' +
    '<span class="logo-lg">' +
    '<img class="img-responsive" alt="Responsive image" style="width: 100%;max-width: 500px;float: left;" src="/img/biglogo1.png">' +
    // '<b style="float: right;font-size: 30px;">竞赛管理平台</b>' +
    '</span>' +
    '</a>' +
    '<nav class="navbar navbar-static-top" role="navigation">' +
    '<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">' +
    '<span class="glyphicon glyphicon-menu-hamburger" style="font-size: 20px;"></span>' +
    '</a>' +
    '<div class="navbar-custom-menu" style="font-size: 16px;margin-right: 50px;">' +
    '<ul class="nav nav-pills">' +
    '<li role="presentation" class="dropdown">' +
    '<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">' +
    '<span class="glyphicon glyphicon-user" style="font-size: 30px;margin-right: 7px;top: 2px;"></span>' +
    '<span style="position: absolute;top: 5px;">' +
    '<p id="nav-usertruename" style="margin-bottom: 0px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;max-width: 100px;"></p>' +
    '<p id="nav-username" style="margin-bottom: 0px;"></p> ' +
    '<p id="nav-identity"></p> ' +
    '</span>' +
    '<span class="caret" style="margin-left: 80px;"></span>' +
    '</a>' +
    '<ul class="dropdown-menu" style="text-align: center;">' +
    '<li id="nav-upinfo" style="margin: 5px;"><a href="/student/upinfo">个人信息</a></li>' +
    '<li id="nav-teacher-upinfo" style="margin: 5px;"><a href="/teacher/upinfo">个人信息</a></li>' +
    '<li id="nav-teacher-password" style="margin: 5px;"><a href="/teacher/password">修改密码</a></li>' +
    '<li id="nav-admin-upinfo" style="margin: 5px;"><a href="/admin/upinfo">修改密码</a></li>' +
    '<li id="nav-logoff" style="margin: 5px;"><a href="/logoff">退出登录</a></li>' +
    '</ul>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '</nav>');

$(".main-sidebar").html(
    '<section class="sidebar" style="">' +
    '<ul id="admin_nav_ul" class="sidebar-menu" data-widget="tree">' +
    '<li id="nav-home" class="jzy_mg_top_14 fs_16 nav_top_li treeview">' +
    '<a href="/">' +
    '<i class="glyphicon glyphicon-home"></i>' +
    '<span style="margin-left: 10px;">首页</span>' +
    '</a>' +
    '</li>' +
    '</ul>' +
    '</section>');

function navstr(id, link, name, type) {
    return '<li id="' + id + '" class="jzy_mg_top_14 fs_16 nav_top_li treeview">' +
        '<a href="' + link + '"><i class="' + type + '"></i><span style="margin-left: 10px;">' + name + '</span></a></li>'
}

function nowpage(id, link) {
    var reg = new RegExp('^'+link);
    if (reg.test(window.location.pathname)) {
        $('li[id="nav-home"]').find('a').css("color", "#000")
        $('li[id="' + id + '"]').find('a').css("color", "#419ce6")
    }

}

$.ajax({
    url: "/?info=identity",
    type: "GET",
    async: false,
    success: function(returndata) {
        if (window.location.pathname == '/login') {
            $('.navbar-custom-menu').remove();
            $('.sidebar-toggle').remove();
            $('.dropdown-menu').remove();
            $('.main-header').css('background-color', '#F6F8F9');
            return;
        }
        var identity = returndata.identity;
        var username = returndata.username;
        var ins;
        $("#nav-username").text(username);
        $("#nav-identity").text(identity);
        $("#nav-identity").hide();
        if (!returndata.username) { //未填写信息
            $("#nav-usertruename").text("未填写姓名");
            $("#nav-home span").text("信息不完整")
        }
        if (identity == "student") {
            $("#admin_nav_ul").append(navstr('nav-competition_list', '/competition', '竞赛', 'glyphicon glyphicon-education'))
            // $("#admin_nav_ul").append(navstr('nav-news', '/news', '新闻', 'glyphicon glyphicon-bullhorn'))
            $("#admin_nav_ul").append(navstr('nav-studentrecord', '/student/record', '我的竞赛', 'glyphicon glyphicon-th'))
            nowpage('nav-home', '/')
            nowpage('nav-competition_list', '/competition')
            nowpage('nav-studentrecord', '/student/record')
            $("#nav-usertruename").text(returndata.name);
            $('#nav-teacher-upinfo').hide();
            $('#nav-teacher-password').hide();
            $('#nav-admin-upinfo').hide();

        } else if (identity == "teacher") {
            $("#admin_nav_ul").append(navstr('nav-competition_list', '/competition', '竞赛', 'glyphicon glyphicon-education'))
            // $("#admin_nav_ul").append(navstr('nav-news', '/news', '新闻', 'glyphicon glyphicon-bullhorn'))
            $("#admin_nav_ul").append(navstr('nav-competition', '/teacher/competition', '竞赛管理', 'glyphicon glyphicon-th'))
            // $("#admin_nav_ul").append(navstr('nav-deal_records', '/teacher/record', '处理报名', 'glyphicon glyphicon-ok-sign'))
            // $("#admin_nav_ul").append(navstr('nav-prize', '/teacher/prize', '颁奖', 'glyphicon glyphicon-king'))
            $("#admin_nav_ul").append(navstr('nav-inquire', '/teacher/inquire', '查询', 'fa fa-pie-chart fs_18'))
            $("#admin_nav_ul").append(navstr('nav-statistic', '/teacher/statistic', '统计', 'glyphicon glyphicon-save'))
            $("#admin_nav_ul").append(navstr('nav-input', '/teacher/input', '导入', 'glyphicon glyphicon-open'))
            nowpage('nav-home', '/')
            nowpage('nav-competition_list', '/competition')
            nowpage('nav-competition', '/teacher/competition')
            nowpage('nav-inquire', '/teacher/inquire')
            nowpage('nav-statistic', '/teacher/statistic')
            nowpage('nav-input', '/teacher/input')
            $("#nav-usertruename").text("负责人");
            $('#nav-upinfo').hide();
            $('#nav-admin-upinfo').hide();

        } else if (identity == "admin") {
            $("#admin_nav_ul").append(navstr('nav-competition_list', '/admin/competition', '竞赛管理', 'glyphicon glyphicon-education'))
            $("#admin_nav_ul").append(navstr('nav-news_add', '/admin/news', '新闻管理', 'glyphicon glyphicon-bullhorn'))
            $("#admin_nav_ul").append(navstr('nav-competition', '/admin/teacher', '负责人管理', 'glyphicon glyphicon-th'))
            $("#admin_nav_ul").append(navstr('nav-inquire', '/admin/inquire', '查询', 'fa fa-pie-chart fs_18'))
            $("#admin_nav_ul").append(navstr('nav-statistic', '/admin/statistic', '统计', 'glyphicon glyphicon-download-alt'))
            nowpage('nav-home', '/')
            nowpage('nav-competition_list', '/admin/competition')
            nowpage('nav-news_add', '/admin/news')
            nowpage('nav-competition', '/admin/teacher')
            nowpage('nav-inquire', '/admin/inquire')
            nowpage('nav-statistic', '/admin/statistic')
            $("#nav-usertruename").text("管理员");
            $('#nav-upinfo').hide();
            $('#nav-teacher-upinfo').hide();
            $('#nav-teacher-password').hide();

        } else if (identity == "root") {
            $("#admin_nav_ul").append(navstr('nav-log', '/root/logs', '日志', 'glyphicon glyphicon-th'))
            $("#admin_nav_ul").append(navstr('nav-records', '/root/records', '申请信息查看', 'glyphicon glyphicon-ok-sign'))
            $("#admin_nav_ul").append(navstr('nav-admin_add', '/root/admin/new', '新建管理员', 'glyphicon glyphicon-king'))
            $("#admin_nav_ul").append(navstr('nav-dbmanage', '/root/db', '数据库操作', 'glyphicon glyphicon-th'))
            nowpage('nav-home', '/')
            nowpage('nav-log', '/root/logs')
            nowpage('nav-records', '/root/records')
            nowpage('nav-admin_add', '/root/admin/new')
            nowpage('nav-dbmanage', '/root/db')
            $("#nav-usertruename").text("超级管理员");
            $('#nav-upinfo').hide();
            $('#nav-teacher-upinfo').hide();
            $('#nav-teacher-password').hide();
            $('#nav-admin-upinfo').hide();
        } else {
            $('#nav-upinfo').hide();
            $('#nav-teacher-upinfo').hide();
            $('#nav-teacher-password').hide();
            $('#nav-admin-upinfo').hide();
        }
    }
})