function isManagedProfile(req){
	
	// we need logged user
	if(!req.user) return false;
	
	// all fields that contain profile id during requests
	let profiles = [req.body.profile,req.query.profile,req.params.profile];
	
	if(!req.user.managedProfiles || !req.user.managedProfiles.length) return false;
	
	// if any of the profile ids is NOT found in managed profiles, some() returns true, then we return false;
	var result = !profiles.some(profileId => profileId && req.user.managedProfiles.indexOf(profileId) < 0);
	
	return result;
}

module.exports = {
	
	"profiles": {
		"read": req => {
			return true;
		},
		"list": req => {
			if(isManagedProfile(req)) req.query.hidden = true;
			return true;
		},
		"write": function(req){
			return isManagedProfile(req);
		}

	},
	
	"profile-budgets": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"profile-etls": {
		"list": function(req){
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
	
	"profile-image": {
		"write": function(req){
			return isManagedProfile(req);
		}
	},
	
	"profile-managers": {
		"list": function(req){			
			return isManagedProfile(req);
		}
	},
	
	"etl": {
		"list": function(req){			
			return isManagedProfile(req);
		}
	}
	
};