"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "users": {
        "read": function (req) { return req.user.id === req.params.id; },
        "write": function (req) { return req.user.id === req.params.id; }
    },
    "login": {
        "renew": true
    }
};
