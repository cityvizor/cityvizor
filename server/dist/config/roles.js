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
exports.aclRoles = {
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
        "profile-years": { "list": function (req) { return isManagedProfile(req); }, "read": function (req) { return isManagedProfile(req); } },
        "profile-import": { "write": function (req) { return isManagedProfile(req); } }
    },
    "profile-manager": {
        "profiles": { "read": true, "list": true, "write": function (req) { return isManagedProfile(req); } },
        "profile-budgets": { "write": function (req) { return isManagedProfile(req); } },
        "profile-years": { "list": function (req) { return isManagedProfile(req); }, "read": function (req) { return isManagedProfile(req); }, "write": function (req) { return isManagedProfile(req); } },
        "profile-events": { "list": function (req) { return isManagedProfile(req); }, "write": function (req) { return isManagedProfile(req); } },
        "profile-expenditures": { "write": function (req) { return isManagedProfile(req); } },
        "profile-image": { "write": function (req) { return isManagedProfile(req); } },
        "profile-import": { "write": function (req) { return isManagedProfile(req); } },
        "profile-managers": { "list": function (req) { return isManagedProfile(req); } },
        "etl": { "list": false }
    },
    "user": {
        "users": { "read": function (req) { return req.user.id === req.params.id; }, "write": function (req) { return req.user.id === req.params.id; } },
        "login": { "renew": true }
    }
};
