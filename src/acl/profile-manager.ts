
export const ACL_ProfileManager = {
	
	"profile-admin": (user,params) => params.profile && user.managedProfiles.indexOf(params.profile) >= 0;
	
};