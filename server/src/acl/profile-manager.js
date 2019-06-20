function isManagedProfile(req){
	
	let user = req.user;
	let profileId = req.params.profile;
	
	// we need logged user
	if(!user) return false;
	
	if(!user.managedProfiles || !user.managedProfiles.length) return false;
		
	// if any of the profile ids is NOT found in managed profiles, some() returns true, then we return false;
	return (profileId && user.managedProfiles.indexOf(profileId) !== -1);
}

module.exports = {
	
	"profiles": {
		"read": true,
		"list": true,
		"write": req => isManagedProfile(req)
	},
	
	"profile-budgets": {
		"write": req => isManagedProfile(req)
	},
	
	"profile-etls": {
		"list": req => isManagedProfile(req),
		"read": req => isManagedProfile(req),
		"write": req => isManagedProfile(req)
	},
	
	"profile-events": {
		"list": req => isManagedProfile(req),
		"write": req => isManagedProfile(req)
	},
	
	"profile-expenditures": {
		"write": req => isManagedProfile(req)
	},
	
	"profile-image": {
		"write": req => isManagedProfile(req)
	},
	
	"profile-managers": {
		"list": req => isManagedProfile(req)
	},
	
	"etl": {
		"list": false
	}
	
};