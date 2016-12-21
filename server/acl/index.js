var aclRoles = {};
aclRoles["admin"] = require("./admin");
aclRoles["guest"] = require("./guest");
aclRoles["profile-manager"] = require("./profile-manager");

function evalPermission(permission,req){
	if(typeof permission == 'function') return permission(req);
	else if (permission === true) return true;
	else return false;
}

function evalACL(resource,operation,req){

	var roles = [aclRoles.guest];
	
	if(req.user && req.user.roles) {
		req.user.roles.forEach(role => {
			if(aclRoles[role]) roles.push(aclRoles[role]);
		});
	}
	
	return roles.some(role => {
		
		// in case we have set permission for resource and action
		if(role[resource] && role[resource][operation]) return evalPermission(role[resource][operation],req);
		
		// in case we have set permission for resource and default action
		else if(role[resource] && role[resource]["*"]) return evalPermission(role[resource]["*"],req);
		
		// in case we have set default permission
		else if(role["*"]) return evalPermission(role["*"],req);
		
		// if nothing is set, user does not have permission
		else return false;
	});
	
}


module.exports = function(resource,operation){

	return function(req,res,next){
		
		var result = evalACL(resource,operation,req);
		
		console.log("ACL " + (result ? "OK" : "XX") + ": " + resource + "/" + operation + (req.user ? " (user: " + req.user._id + "; roles: " + (req.user.roles ? req.user.roles.join(",") : "") + ")" : ""));
		
		if(result) next();
		else res.sendStatus(401);
	}
};