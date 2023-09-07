function isManagedProfile(req): boolean {
  const user = req.user;
  const profileId = Number(req.params.profile);
  return userManagesProfile(user, profileId);
}

function isLoggedUser(req) {
  const user = req.user;
  const userId = Number(req.params.user);

  return userId && user.id === userId;
}

export function userManagesProfile(user, profileId: number): boolean {
  // we need logged user
  if (!user) return false;

  // we need profile id
  if (!profileId) return false;

  if (!user.managedProfiles || user.managedProfiles.length === 0) return false;

  return user.managedProfiles.indexOf(profileId) !== -1;
}

export const aclRoles = {
  guest: {
    can: {
      'login:login': true,
    },
  },

  user: {
    can: {
      'users:list': true,
      'users:read': req => isLoggedUser(req),
      'users:write': req => isLoggedUser(req),
      'login:renew': true,
    },
  },

  admin: {
    can: {
      'profiles:list': true,
      'profiles:read': true,
      'profiles:write': true,
      'profile-years:list': true,
      'profile-years:read': true,
      'profile-years:write': true,
      'profile-imports:list': true,
      'profile-accounting:list': true,
      'profile-accounting:write': true,
      'users:list': true,
      'users:read': true,
      'users:write': true,
      'options:read': true,
      'options:write': true,
    },
  },

  importer: {
    can: {
      'profile-accounting:write': req => isManagedProfile(req),
    },
  },

  'profile-admin': {
    can: {
      'profiles:list': true,
      'profiles:read': true,
      'profiles:write': req => isManagedProfile(req),
      'profile-years:list': true,
      'profile-years:read': true,
      'profile-years:write': req => isManagedProfile(req),
      'profile-imports:list': true,
      'profile-accounting:list': true,
      'profile-accounting:write': req => isManagedProfile(req),
      'options:read': true,
      'options:write': false,
    },
  },
};
