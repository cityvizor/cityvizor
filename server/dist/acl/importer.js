"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isManagedProfile(req) {
    var user = req.user;
    var profileId = req.params.profile;
    // we need logged user
    if (!user)
        return false;
    // we need profile id
    if (!profileId)
        return false;
    if (!user.managedProfiles || !user.managedProfiles.length)
        return false;
    // if any of the profile ids is NOT found in managed profiles, some() returns true, then we return false;
    return (profileId && user.managedProfiles.indexOf(profileId) !== -1);
}
exports.default = {
    "profile-years": {
        "list": function (req) { return isManagedProfile(req); },
        "read": function (req) { return isManagedProfile(req); }
    },
    "profile-import": {
        "write": function (req) { return isManagedProfile(req); }
    }
};
