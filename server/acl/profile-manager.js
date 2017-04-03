function isManagedProfile(req){
	let profile = req.body.profile || req.query.profile || req.params.profile || null;
	return req.user && profile && req.user.managedProfiles.indexOf(profile) >= 0;
}

module.exports = {
	
	"profile": {
		"write": function(req){
			return isManagedProfile(req);
		}

	},
	
	"budget": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"events": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"expenditures": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"users": {
		"list": function(req){
			return isManagedProfile(req);
		}
	}
	
};