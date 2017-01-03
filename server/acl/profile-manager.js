module.exports = {
	
	"profile": {
		
		"read": true,
		"list": true,
		
		"write": function(req){
			if(req.user && req.user.managedProfiles.indexOf(req.params.id) >= 0) return true;
			return false;
		},

	},
	
	"budget": {
		"read": true,
		
		"write": function(req){
			if(req.user && req.user.managedProfiles.indexOf(req.params.id) >= 0) return true;
			return false;
		},
	},
	
	"expenditures": {
		"read": true,
		
		"write": function(req){
			if(req.user && req.user.managedProfiles.indexOf(req.params.id) >= 0) return true;
			return false;
		}
	}
	
};