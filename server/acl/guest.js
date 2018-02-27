module.exports = {
	
	"entity": {
		"read": true,
		"list": true
	},
	
	"events": {
		"read": true,
		"list": true
	},
	
	"profiles": {
		"read": true,//req => req.query.hidden ? false : true,
		"list": req => req.query.hidden ? false : true
	},
	
	"profile-budgets": {
		"read": true,
		"list": true
	},
	
	"profile-etls": {
		"read": false,
		"list": false
	},
	
	"profile-events": {
		"read": true,
		"list": true
	},
	
	"profile-image": {
		"read": true
	},
	
	"profile-payments": {
		"list": true
	},
	
	"profile-contracts": {
		"list": true
	},
	
	"profile-noticeboard": {
		"read": true
	},
	
	"login": {
		"login": true
	},
	
	"exports-profiles": {
		"list": true,
		"read": true
	},
	"exports-etls": {
		"read": true
	},
	"exports-budgets": {
		"read": true
	},
	"exports-payments": {
		"read": true
	},
	
	"codelists": {
		"read": true,
		"list": true
	}
	
};