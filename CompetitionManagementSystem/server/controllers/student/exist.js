var Student = require("../../models/student.js");
var Teacher = require("../../models/leader.js");

module.exports = function(req, res, id) {
    Student.findById(id, function(err, result1) {
        if (err) {
            res.send("error");
            throw err;
            return
        }
        if (result1) res.send("1");
        else {
        	Teacher.findById(id, function(err, result2) {
                if (err) {
                    res.send("error");
                    throw err;
                    return
                }
                if (result2) res.send("2");
                else res.send("0");
            })
        }
        
    });

}