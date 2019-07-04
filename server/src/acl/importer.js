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

	"profile-etls": {
		"list": req => isManagedProfile(req),
		"read": req => isManagedProfile(req)
	},

	"profile-import": {
		"write": req => isManagedProfile(req)
	}
	
};