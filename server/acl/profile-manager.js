function isManagedProfile(req){
	return req.user && req.user.managedProfiles.indexOf(req.body.profile) >= 0;
	
}

module.exports = {
	
	"profile": {
		
		"read": true,
		"list": true,
		
		"write": function(req){
			return isManagedProfile(req);
		},

	},
	
	"budget": {
		"read": true,
		
		"write": function(req){
			return isManagedProfile(req);
		},
	},
	
	"events": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"expenditures": {
		"read": true,
		
		"write": function(req){
			console.log(req.body);
			return isManagedProfile(req);
		}
	}
	
};