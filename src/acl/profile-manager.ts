
export const ACL_ProfileManager = {
	
	/* Profile manager can administrate his user profile */
	"user-admin": (user,params) => (params.user && user._id === params.user),
	
	/* Profile manager can administrate assigned profiles */
	"profile-admin": (user,params) => params.profile && user.managedProfiles.indexOf(params.profile) >= 0
	
};