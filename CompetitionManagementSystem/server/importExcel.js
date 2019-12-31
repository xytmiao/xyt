var defaultTeacher = "t123456"; // 所有竞赛的默认负责人设置


var Excel = require('exceljs');
var async = require('async');
var Competition = require("./models/competition.js");
var db = require("./models/db.js");

var workbook = new Excel.Workbook();

// 导入excel
workbook.xlsx.readFile('import.xlsx').then(function(){
    var worksheet = workbook.getWorksheet("按照级别");
    var isGraduate = false;
    var num = 0; // 计数
    var No = 0; // 判断本科生和研究生的分界线
    var map = {
    	'A': 0,
    	'B': 1,
    	'C': 2
    }
    var tasks = [];
	worksheet.eachRow(function(row, rowNumber){
		if(typeof(row.getCell(1).value) == "number"){
			num++;
			var data = [];
			var obj = {"no": num};
			row.eachCell(function(cell, colNumber){
				var value = cell.value;
				if(typeof(value) == "object") value = cell.text;
				data.push(value);
			});
			if(data[0] < No) isGraduate = true;
			No = data[0];
			obj.name = data[1];
			obj.rank = data[2];
			obj.sponsor = data[3];
			obj.isGraduate = isGraduate;
			obj.teacher = defaultTeacher;
			if(data[4][0] == "一") {
				obj.level = 1;
				obj.class = map[ data[4][2] ];
			}
			else if(data[4][0] == "二") obj.level = 2;
			else if(data[4][0] == "三") obj.level = 3;
			tasks.push(function(callback) {
				Competition.create(obj, function(err) {
					if (err) callback (err);
					else callback(null);
				});
			});
			console.log(obj);
		}
	});
	async.waterfall(tasks, function(err) {
		console.log("endend");
		db.close();
		if (err) throw err;
	})
});


