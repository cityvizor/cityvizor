function isManagedProfile(req) {

  let user = req.user;
  let profileId = req.params.profile;

  // we need logged user
  if (!user) return false;

  // we need profile id
  if (!profileId) return false;

  if (!user.managedProfiles || !user.managedProfiles.length) return false;

  // if any of the profile ids is NOT found in managed profiles, some() returns true, then we return false;
  return (profileId && user.managedProfiles.indexOf(profileId) !== -1);
}

export const aclRoles = {
  "admin": {
    // access all
    "*": true
  },

  "guest": {

    "budgets": { "read": true, "list": true },
    "codelists": { "read": true, "list": true },
    "counterparty": { "read": true, "list": true },
    "entity": { "read": true, "list": true },
    "events": { "read": true, "list": true },
    "etls": { "read": true, "list": true },
    "profiles": { "read": true, "list": true },

    "profile-accounting": { "read": true, "list": true },
    "profile-contracts": { "list": true },
    "profile-dashboard": { "read": true },
    "profile-etls": { "read": false, "list": true },
    "profile-events": { "read": true, "list": true },
    "profile-image": { "read": true },
    "profile-noticeboard": { "read": true },
    "profile-payments": { "list": true },
    "profile-years": { "read": true, "list": true },

    "login": { "login": true },

    "payments": { "read": true, "list": true },

  },

  "importer": {
    "profile-years": { "list": req => isManagedProfile(req), "read": req => isManagedProfile(req) },
    "profile-import": { "write": req => isManagedProfile(req) }
  },

  "profile-manager": {

    "profiles": { "read": true, "list": true, "write": req => isManagedProfile(req) },
    "profile-budgets": { "write": req => isManagedProfile(req) },
    "profile-years": { "list": req => isManagedProfile(req), "read": req => isManagedProfile(req), "write": req => isManagedProfile(req) },
    "profile-events": { "list": req => isManagedProfile(req), "write": req => isManagedProfile(req) },
    "profile-expenditures": { "write": req => isManagedProfile(req) },
    "profile-image": { "write": req => isManagedProfile(req) },
    "profile-import": { "write": req => isManagedProfile(req) },
    "profile-managers": { "list": req => isManagedProfile(req) },
    "etl": { "list": false }
  },

  "user": {
    "users": { "read": (req) => req.user.id === req.params.id, "write": (req) => req.user.id === req.params.id },
    "login": { "renew": true }
  }
}