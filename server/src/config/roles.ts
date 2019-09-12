function isManagedProfile(req) {

  let user = req.user;
  let profileId = Number(req.params.profile);

  // we need logged user
  if (!user) return false;

  // we need profile id
  if (!profileId) return false;

  if (!user.managedProfiles || !user.managedProfiles.length) return false;

  // if any of the profile ids is NOT found in managed profiles, some() returns true, then we return false;
  return (profileId && user.managedProfiles.indexOf(profileId) !== -1);
}

function isLoggedUser(req) {
  let user = req.user;
  let userId = Number(req.params.user);

  return user.id === userId;

}

export const aclRoles = {

  "guest": {
    "login": { "login": true }
  },

  "user": {
    "users": { "list": true, "read": req => isLoggedUser(req), "write": req => isLoggedUser(req) },
    "login": { "renew": true }
  },


  "admin": {
    "profiles": { "list": true, "read": true, "write": true },
    "profile-years": { "list": true, "read": true, "write": true },
    "profile-imports": { "list": true },
    "profile-accounting": { "list": true },
    "users": { "list": true, "read": true, "write": true }
  },

  "importer": {
    "profile-accounting": { "write": req => isManagedProfile(req) }
  },

  "profile-admin": {
    "profiles": { "list": true, "read": true, "write": req => isManagedProfile(req) },
    "profile-years": { "list": true, "read": true, "write": req => isManagedProfile(req) },
    "profile-imports": { "list": true },
    "profile-accounting": { "list": true }    
  },


}