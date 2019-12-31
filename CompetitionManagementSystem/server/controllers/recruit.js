var Record = require("../models/record.js");
var Competition = require("../models/competition.js");
var Student = require("../models/student.js");
var EventEmitter = require('events').EventEmitter;

module.exports = function(req, res, cid){
    Competition.findById(cid, function(err, c) {
        if(err){
            res.send("error");
            throw err;
            return;
        }
        if (!c) {
            res.end();
            return;
        }
        Record.findByFather(c.latest, function(err, rs){
            if(err){
                res.send("error");
                throw err;
                return;
            }
            if (!rs.length) {
                res.end();
                return;
            }
            var data = [];
            ee = new EventEmitter();
            ee.once("done", () => res.send(data));
            var cnt = 0;
            rs.forEach(r => {
                Student.findById(r.member[0].username, function(err, s){
                    if(err){
                        res.send("error");
                        throw err;
                        return;
                    }
                    s || (s = {});
                    data.push({                    	
                        "recruit": r.recruit,
                        "category": r.category,
                        "item": r.item,
                        "captain": s.name,
                        "phone": s.phone,
                        "total": r.member.length,
                        "introduction": r.introduction,
                        "condition":r.condition,
                    });
                    if (++cnt == rs.length) ee.emit("done");
                });
            })
        })
    }) 
}