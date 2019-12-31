console.time("服务器启动耗时");
var express = require('express');
var app = express();
var session = require("express-session");
var multer = require('multer');
var fs = require("fs");
var path = require("path");
var sd = require("silly-datetime");
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var qs = require("qs");
require("./models/db.js") // 数据库初始化连接

console.log(sd.format(new Date, 'YYYY-MM-DD HH:mm:ss'));

fs.existsSync("./uploads") || fs.mkdirSync("./uploads"); // 暂存上传文件
fs.existsSync("./enclosure") || fs.mkdirSync("./enclosure"); // 存放附件
fs.existsSync("./dump_zip") || fs.mkdirSync("./dump_zip"); // 存放数据库备份zip
// fs.existsSync("./config.js") || fs.writeFileSync("./config.js", '');

global.config = require("./config"); // 读入配置文件

require("./models/clock.js") // 定时执行任务

// 创建用于存储日志的文件夹
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// 创建错误输出流
var errorLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'error-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})

// 重写错误输出，输出到控制台和文件
console.error = function(err) {
    console.log(sd.format(Date.now, '[YYYY-MM-DD HH:mm:ss]') + err);
    errorLogStream.write(sd.format(Date.now, '[YYYY-MM-DD HH:mm:ss]') + err + "\n");
}

// 捕获未捕获的异常，以免进程挂掉，并输出到日志
process.on('uncaughtException', function(err) {
    console.error(err.stack);
});

// 创建日志输出流
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})

// 设置日志格式
morgan.token('date', function(req, res) {
    return sd.format("YYYY-MM-DD HH:mm:ss");
});
morgan.token('user', function(req, res) {
    return req.session ? (req.session.username || 0) : 0;
})
morgan.token('remote-addr', function(req, res) {
    return req.ip.replace(/::ffff:/, '');
})
morgan.format("mine", '[:date] [:user] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"')

// 设置日志中间件
app.use(morgan('mine', { stream: accessLogStream }))

// 错误具体信息不返回前端
app.set('env', 'production');

// 分析post请求头
app.use(express.urlencoded({ 
    extended: true,
    limit: "100mb",
}));

// 设置session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

// 文件上传设置
var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads') //文件保存的路径
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname) //文件名
        }
    }),
    limits: {
        fieldSize: 100 * 1024 * 1024
    }
})

// 主动报错
app.get("/error", function(req, res) {
    // throw "cuowula";
    fs.readFile("dasfq", function(err) {
        if (err) {
            res.send("error");
            throw err;
        }
    })
})

// 静态服务public和enclosure文件夹
app.use(express.static('./public', {
    dotfiles: "allow" // 允许访问.开头的文件
}));
app.use(express.static('./enclosure', { dotfiles: "allow" }));

// 生成验证码
app.get("/captcha", function(req, res) {
    require("./controllers/captcha.js")(req, res);
})
app.get('/test', function(req, res) {
    res.sendFile(__dirname + '/public/main.html')
})
// 登录
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html')
})
app.post('/login', function(req, res) {
    require('./controllers/login.js')(req, res);
})

// 注册
app.post('/register', function(req, res) {
    require('./controllers/student/register.js')(req, res);
})

// 忘记密码
app.post('/gbpassword/first', function(req, res) {
    // 账号和邮箱验证
    require('./controllers/gbpassword.js').first(req, res);
})
app.post("/gbpassword/second", function(req, res) {
    // 验证码校验和新密码
    require('./controllers/gbpassword.js').second(req, res);
})

// 注销
app.get("/logoff", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
})

// 预判断
app.use(function(req, res, next) {
    if (req.session.isComplete) next();
    else require("./controllers/prejudge.js")(req, res, next);
})

// 分配路由权限
var student = express(),
    teacher = express(),
    admin = express(),
    root = express();
app.use("/student", student);
app.use("/teacher", teacher);
app.use("/admin", admin);
app.use("/root", root);

//首页
app.get('/', function(req, res) {
    switch (req.query.info) {
        case "identity": //根据session判断身份，展示不同导航栏
            res.json({
                identity: req.session.identity,
                username: req.session.username,
                name: req.session.name
            });
            break;
        case "news":
            require("./controllers/newss.js")(req, res, req.query.page);
            break;
        case "newspage":
            require("./controllers/news_page.js")(req, res)
            break;
        default:
            res.sendFile(__dirname + "/public/newss.html");
            break;
    }
})

//某个新闻
app.get("/news/:news", function(req, res) {
    if (req.query.info) require("./controllers/news.js")(req, res, req.params.news);
    else res.sendFile(__dirname + "/public/news.html");
})

//竞赛列表页 /competition
app.get("/competition", function(req, res) {
    if (req.query.info) require("./controllers/competitions.js")(req, res);
    else res.sendFile(__dirname + "/public/competitions.html");
})

//竞赛详情页 /competition/:c
app.get("/competition/:c", function(req, res) {
    switch (req.query.info) {
        case "competition": 
            require("./controllers/competition.js")(req, res, req.params.c);
            break;
        case "noticepage": 
            require("./controllers/notice_page.js")(req, res, req.params.c);
            break;
        case "notice": 
            require("./controllers/notices.js")(req, res, req.params.c, req.query.page); 
            break;
        case "attend": 
            require("./controllers/student/isattend.js")(req, res, req.params.c);
            break;
        case "recruit":
            require("./controllers/recruit.js")(req, res, req.params.c);
            break;
        default:
            res.sendFile(__dirname + "/public/competition.html");
    }
})

// 通知详情页
app.get("/notice/:n", function(req, res) {
    if (req.query.info) require("./controllers/notice.js")(req, res, req.params.n);
    else res.sendFile(__dirname + "/public/notice.html");
})

//竞赛报名页 点击后后端判断竞赛单人还是多人再返回网页
app.get("/competition/:one/attend", function(req, res) {
    if (req.query.info) require("./controllers/student/attend_one.js")(req, res, req.params.one);
    else require("./controllers/student/attend_method.js")(req, res, req.params.one);
    // else res.sendFile(__dirname + "/public/student/multiattend.html");
})
app.post("/competition/:one/attend", function(req, res) {
    if (req.query.info=="leader") require("./controllers/teacher/input_leader.js")(req, res, req.params.leader); 
    else require("./controllers/student/attend_yes.js")(req, res, req.params.one);
})

// 报名时某个学号是否已经注册
app.get("/exist", function(req, res) {
    // e.g. /exist?id=10160339
    if (req.query.id) require("./controllers/student/exist.js")(req, res, req.query.id);
    else res.end(); // 防止挂起
})

// 获取全部指导老师
app.get("/leaders", function(req, res) {
    require("./controllers/getLeaders.js")(req, res);
})
//*********************************************************学生

// 个人信息页面 /student/upinfo
student.get("/upinfo", function(req, res){
    if(req.query.info) require("./controllers/student/getinfo.js")(req, res);
    else res.sendFile(__dirname + "/public/student/upinfo.html");
})

// 修改个人信息页面 /student/upinfo/change
student.get("/upinfo/change", function(req, res){
    if(req.query.info) require("./controllers/student/getinfo.js")(req, res);
    else res.sendFile(__dirname + "/public/student/upinfo_change.html");
})

student.post("/upinfo/change", function(req, res){
    require("./controllers/student/upinfo.js")(req, res);
})

// 我的竞赛 /student/record
student.get("/record", function(req, res) {
    if (req.query.info) require("./controllers/student/records.js")(req, res);
    else res.sendFile(__dirname + "/public/student/records.html");
})

// 我的竞赛报名具体情况 /student/record/:record
student.get("/record/:record", function(req, res) {
    if (req.query.info) require("./controllers/student/record.js")(req, res, req.params.record);
    else res.sendFile(__dirname + "/public/student/record.html");
})

// 修改报名信息
student.post("/record/:record", function(req, res) {
    if (req.query.info=="leader") require("./controllers/teacher/input_leader.js")(req, res, req.params.leader); 
    else require("./controllers/student/record_edit.js")(req, res, req.params.record);
    
})

// 取消某个报名
student.post("/record/:r/cancel", function(req, res) {
    require("./controllers/student/record-.js")(req, res, req.params.r);
})

//*********************************************************负责人
teacher.use(function(req, res, next) {
    if (req.session.identity != "teacher") res.sendFile(__dirname + "/public/404.html");
    else next();
})

// 个人信息页面 /teacher/upinfo
teacher.get("/upinfo", function(req, res){
    if(req.query.info) require("./controllers/teacher/getinfo.js")(req, res);
    else res.sendFile(__dirname + "/public/teacher/upinfo.html");
})

// 修改个人信息页面 /teacher/upinfo/change
teacher.get("/upinfo/change", function(req, res){
    if(req.query.info) require("./controllers/teacher/getinfo.js")(req, res);
    else res.sendFile(__dirname + "/public/teacher/upinfo_change.html");
})

teacher.post("/upinfo/change", function(req, res){
    require("./controllers/teacher/upinfo.js")(req, res);
})

// 负责人修改密码 /teacher/upinfo
teacher.get("/password", function(req, res) {
    res.sendFile(__dirname + "/public/teacher/password_change.html"); //res.sendFile为express中发送一整个HTML文本的函数
})
teacher.post("/password", function(req, res) {
    require("./controllers/teacher/password_change.js")(req, res);
})

//负责人查看自己负责的竞赛 /teacher/competition
teacher.get("/competition", function(req, res) {
    // 所有自己负责的竞赛大类
    if (req.query.info) require("./controllers/teacher/competitions.js")(req, res);
    else res.sendFile(__dirname + "/public/teacher/competitions.html");
});

// 某一竞赛不同版本列表 /teacher/competition/:c
teacher.get("/competition/:c", function(req, res) {
    if (req.query.info) {
        switch (req.query.info) {
            case "ones":
                require("./controllers/teacher/competition.js")(req, res, req.params.c);
                break;
            case "onenew":
                require("./controllers/teacher/competition_new.js")(req, res, req.params.c);
                break;
            case "notice":
                require("./controllers/notices.js")(req, res, req.params.c, req.query.page);
                break;
            case "noticepage":
                require("./controllers/notice_page.js")(req, res, req.params.c);
                break;
            case "records":
                require("./controllers/teacher/records.js")(req, res, req.params.c);
                break;
            case "record":
                require("./controllers/teacher/record.js")(req, res, req.query.record);
                break;
            case "prizeDate":
                require("./controllers/teacher/one_prize.js")(req, res, req.params.c);
                break;
            case "prizes":
                require("./controllers/teacher/prize_records.js")(req, res, req.params.c);
                break;
            case "oneedit":
                require("./controllers/teacher/one.js")(req, res, req.query.oneedit);
                break;
            default:
                res.sendFile(__dirname + "/public/teacher/competition.html");
                break;
        }
    } else {
        switch (req.query.action) {
        	case "one"://竞赛列表
                res.sendFile(__dirname + "/public/teacher/competition.html");
                break;
            case "onenew"://添加新一届
                res.sendFile(__dirname + "/public/teacher/competition_new.html");
                break;
            case "notice"://通知列表
                res.sendFile(__dirname + "/public/teacher/notices.html");
                break;
            case "noticenew"://添加新通知
                res.sendFile(__dirname + "/public/teacher/notice_new.html");
                break;
            case "record"://处理学生请求
                res.sendFile(__dirname + "/public/teacher/record.html");
                break;
            case "prize"://获奖
                res.sendFile(__dirname + "/public/teacher/prize.html");
                break;
            case "oneedit"://修改竞赛
                res.sendFile(__dirname + "/public/teacher/one_edit.html");
                break;
            default:
                res.sendFile(__dirname + "/public/teacher/competition.html");
                break;
        }
    }
})

teacher.post("/competition/:c", upload.array('files', 100), function(req, res) {
    switch (req.query.info) {
        case "onenew"://提交新一届
            require("./controllers/teacher/one+.js")(req, res, req.params.c);
            break;
        case "noticenew"://提交新通知
            require("./controllers/teacher/notice_new.js")(req, res, req.params.c);
            break;
        case "record"://提交处理
            require("./controllers/teacher/record_check.js")(req, res, req.query.record);
            break;
        case "prize"://提交获奖
            require("./controllers/teacher/record_prize.js")(req, res);
            break;
        case "oneedit"://提交修改竞赛
            require("./controllers/teacher/one_edit.js")(req, res, req.query.oneedit);
            break;
    }
})

// 负责人删除通知
teacher.post("/notice/:n/delete", function(req, res) {
    require("./controllers/teacher/notice-.js")(req, res, req.params.n);
})

// 负责人修改通知
teacher.get("/notice/:n/edit", function(req, res) {
    if (req.query.info) require("./controllers/notice.js")(req, res, req.params.n);
    else res.sendFile(__dirname + "/public/teacher/notice_edit.html");
})
teacher.post("/notice/:n/edit", upload.array('files', 100), function(req, res) {
     require("./controllers/teacher/notice_edit.js")(req, res ,req.params.n);
})

//信息查询 /teacher/inquire
teacher.get("/inquire", function(req, res) {
    if (req.query.competitionlist) require("./controllers/teacher/inquire_competitionlist.js")(req, res);
    else if (req.query.info) require("./controllers/teacher/inquire_competition.js")(req, res);
    else if (req.query.student) require("./controllers/teacher/inquire_student.js")(req, res, req.query.username);
    else res.sendFile(__dirname + "/public/inquire.html");
})

//信息统计 /teacher/statistic
teacher.get("/statistic", function(req, res) {
    if (req.query.competitionlist) require("./controllers/teacher/inquire_competitionlist.js")(req, res);
    else res.sendFile(__dirname + "/public/statistic.html");
})

//信息统计导出
teacher.get("/statistic/output", function(req, res) {
    if (req.query.info) require("./controllers/teacher/inquire_competition.js")(req, res);
    else res.sendFile(__dirname + "/public/statistic_output.html");
})

// 获取信息统计字段
teacher.get("/field", function(req, res) {
    require("./controllers/teacher/fields.js")(req, res);
})

// 保存信息统计字段
teacher.post("/field", function(req, res) {
    require("./controllers/teacher/field+.js")(req, res);
})

// 导入信息
teacher.get("/input", function(req, res) {
    res.sendFile(__dirname + "/public/teacher/input.html");
})

teacher.post("/input", function(req, res) {
    switch (req.query.info) {
        case "student": 
            require("./controllers/teacher/input_student.js")(req, res);
            break;
        case "leaders":
            require("./controllers/teacher/input_leaders.js")(req, res);
            break;
        case "leader":
            require("./controllers/teacher/input_leader.js")(req, res);
            break;
        case "record":
            require("./controllers/teacher/input_record.js")(req, res);
            break;
        default:
            res.send("???");
    }
})

//*********************************************************管理员
admin.use(function(req, res, next) {
    if (req.session.identity != "admin") res.sendFile(__dirname + "/public/404.html");
    else next();
})

// 管理员修改密码 /admin/upinfo
admin.get("/upinfo", function(req, res) {
    res.sendFile(__dirname + "/public/admin/upinfo.html"); //res.sendFile为express中发送一整个HTML文本的函数
})
admin.post("/upinfo", function(req, res) {
    require("./controllers/admin/upinfo.js")(req, res);
})

// 管理员查看所有竞赛 /admin/competition
admin.get("/competition", function(req, res) {
    if (req.query.info) require("./controllers/admin/competitions.js")(req, res); //app.get() 方法的第一个参数表示url路径，第二个参数是一个callback回调函数，意味着前端url请求访问到该路径时，调用该函数。
    else res.sendFile(__dirname + "/public/admin/competitions.html"); //dirname为当前文件的绝对路径
})

// 管理员添加竞赛 /admin/competition/new
admin.get("/competition/new", function(req, res) {
    res.sendFile(__dirname + "/public/admin/competition_new.html"); //res.sendFile为express中发送一整个HTML文本的函数
})

admin.post("/competition/new", function(req, res) {
    require("./controllers/admin/competition_new.js")(req, res);
})

// 管理员编辑某个竞赛 /admin/competition/:c/edit
admin.get("/competition/:c/edit", function(req, res) {
    if (req.query.info) require("./controllers/admin/competition.js")(req, res, req.params.c);
    else res.sendFile(__dirname + "/public/admin/competition_edit.html");
})
admin.post("/competition/:c/edit", function(req, res) {
    require("./controllers/admin/competition_edit.js")(req, res, req.params.c);
})

//管理员删除某个竞赛
admin.post("/competition/:c/delete", function(req, res) {
    require("./controllers/admin/competition-.js")(req, res, req.params.c);
})

// 管理员查看所有新闻 /admin/news
admin.get("/news", function(req, res) {
    switch (req.query.info) {
        case "news":
            require("./controllers/newss.js")(req, res, req.query.page);
            break;
        case "newspage":
            require("./controllers/news_page.js")(req, res);
            break;
        default:
            res.sendFile(__dirname + "/public/admin/newss.html");
    }
})

// 管理员发布新闻 /admin/news/new
admin.get("/news/new", function(req, res) {
    res.sendFile(__dirname + "/public/admin/news_new.html");
})
admin.post("/news/new", upload.array('files', 100), function(req, res) {
    require("./controllers/admin/news_new.js")(req, res);
})

// 管理员编辑新闻 /admin/news/:new/edit
admin.get("/news/:news/edit", function(req, res) {
    if (req.query.info) require("./controllers/news.js")(req, res, req.params.news);
    else res.sendFile(__dirname + "/public/admin/news_edit.html");
})

admin.post("/news/:news/edit", upload.array('files', 100), function(req, res) {
     require("./controllers/admin/news_edit.js")(req, res ,req.params.news);//增加编辑新闻功能
})

// 管理员删除新闻
admin.post("/news/:n/delete", function(req, res) {
    require("./controllers/admin/news-.js")(req, res, req.params.n);
})

// 管理员查看负责人账号 /admin/teacher
admin.get("/teacher", function(req, res) {
    if (req.query.info) require("./controllers/admin/teachers.js")(req, res);
    else res.sendFile(__dirname + "/public/admin/teacher_all.html");
    
})

// 管理员分配负责人账号 /admin/teacher/new
admin.get("/teacher/new", function(req, res) {
    res.sendFile(__dirname + "/public/admin/teacher+.html");
})

admin.post("/teacher/new", function(req, res) {
    require("./controllers/admin/teacher+.js")(req, res);
})

// 管理员重置负责人密码为默认密码
admin.post("/teacher/:t/reset", function(req, res) {
    require("./controllers/admin/teacher_reset.js")(req, res, req.params.t);
})

//信息查询 /admin/inquire
admin.get("/inquire", function(req, res) {
    if (req.query.competitionlist) require("./controllers/admin/inquire_competitionlist.js")(req, res);
    else if (req.query.info) require("./controllers/admin/inquire_competition.js")(req, res);
    else if (req.query.student) require("./controllers/teacher/inquire_student.js")(req, res, req.query.username);
    else res.sendFile(__dirname + "/public/inquire.html");
})

//信息统计 /admin/statistic
admin.get("/statistic", function(req, res) {
    if (req.query.competitionlist) require("./controllers/admin/inquire_competitionlist.js")(req, res);
    else res.sendFile(__dirname + "/public/statistic.html");
})

//信息统计导出
admin.get("/statistic/output", function(req, res) {
    if (req.query.info) require("./controllers/admin/inquire_competition.js")(req, res);
    else res.sendFile(__dirname + "/public/statistic_output.html");
})

// 获取信息统计字段
admin.get("/field", function(req, res) {
    require("./controllers/teacher/fields.js")(req, res);
})

// 保存信息统计字段
admin.post("/field", function(req, res) {
    require("./controllers/teacher/field+.js")(req, res);
})

//*********************************************************超级管理员
root.use(function(req, res, next) {
    if (req.session.identity != "root") res.sendFile(__dirname + "/public/404.html");
    else next();
})

// 为超级管理员静态log文件夹
root.use(express.static('./log', {
    dotfiles: "allow" // 允许访问.开头的文件
}));

// 为超级管理员静态dump_zip文件夹
root.use(express.static('./dump_zip', {
    dotfiles: "allow" // 允许访问.开头的文件
}));

// 超级管理员查看报名记录
root.get("/records", function(req, res) {
    if (req.query.info) require("./controllers/root/records.js")(req, res);
    else res.sendFile(__dirname + "/public/root/records.html");
})

// 超级管理员分配管理员账号
root.get("/admin/new", function(req, res) {
    res.sendFile(__dirname + "/public/root/admin+.html");
})
root.post("/admin/new", function(req, res) {
    require("./controllers/root/admin+.js")(req, res);
});

// 查看运行日志、错误日志
root.get("/logs", function(req, res) {
    if (req.query.info) require("./controllers/root/logs.js")(req, res);
    else res.sendFile(__dirname + "/public/root/logs.html");
})

// 数据库操作页面
root.get("/db", function(req, res) {
    res.sendFile(__dirname + "/public/root/db_store.html");
})

// 超级管理员主动备份 "/root/db/dump"
root.get("/db/dump", function(req, res) {
    require("./controllers/root/db_dump.js")(req, res);
})

// 超级管理员恢复备份页面
root.get("/db/store", function(req, res) {
    if (req.query.info) require("./controllers/root/db_dumps.js")(req, res);
    else res.end();
})
root.post("/db/store", upload.single('file'), function(req, res) {
    // 恢复已有的备份 "/root/db/store?id=dump-20190319.zip"
    if (req.query.id) require("./controllers/root/db_store.js")(req, res, req.query.id);

    // 上传方式恢复备份
    else require("./controllers/root/db_store_upload.js")(req, res);
})

app.use(function(req, res) {
    res.sendFile(__dirname + "/public/404.html");
})

// 端口监听
var server = app.listen(80, function() {
    console.timeEnd("服务器启动耗时");
    var port = server.address().port;
    console.log("端口：%s", port);
});