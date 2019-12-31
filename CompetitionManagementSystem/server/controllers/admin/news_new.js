var News = require("../../models/news.js");

module.exports = function(req, res) {
    News.add(req.body, req.files, function(err, result) {
        if (err) {
            res.send("error");
            throw err;
            return;
        }
        res.send("success");
    });
}