var Admin = require("../../models/admin.js")

module.exports = function(req, res) {
	Admin.login({
		"username": req.session.username, 
		"password": req.body._password
	}, function(err, r) {
		if (err) {
			res.send("error");
			return;
		}
		if (r != "success") {
			res.send(r);
			return;
		}
		Admin.upInfo(req.session.username, req.body, function(err) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		})
	})
	
}