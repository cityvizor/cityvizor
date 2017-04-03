function isManagedProfile(req){
	let profile = req.body.profile || req.query.profile || req.params.profile || null;
	return req.user && profile && req.user.managedProfiles.indexOf(profile) >= 0;
}

module.exports = {
	
	"profiles": {
		"write": function(req){
			return isManagedProfile(req);
		}

	},
	
	"profile-budgets": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"profile-events": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"profile-expenditures": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"profile-managers": {
		"list": function(req){			
			return isManagedProfile(req);
		}
	}
	
};