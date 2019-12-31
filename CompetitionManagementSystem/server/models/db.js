var mongoose = require('mongoose');
console.time("数据库连接耗时");
mongoose.connect('mongodb://localhost/project', { useNewUrlParser: true });

var db = mongoose.connection;
db.once('open', function (callback) {
    console.timeEnd("数据库连接耗时");
});

module.exports = db;