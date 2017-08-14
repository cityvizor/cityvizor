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
	
	"profile-events": {
		"read": true,
		"list": true
	},
	
	"profile-payments": {
		"list": true
	},
	
	"profile-contracts": {
		"list": true
	},
	
	"login": {
		"login": true
	},
	
	"exports": {
		"read": true
	}
	
};