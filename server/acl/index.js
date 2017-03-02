// load roles from separate files 
var aclRoles = {};
aclRoles["admin"] = require("./admin");
aclRoles["guest"] = require("./guest");
aclRoles["profile-manager"] = require("./profile-manager");

// function to evaluate single permission
function evalPermission(permission,req){
	
	// if permission is a function, then evaluate its return value
	if(typeof permission == 'function') return (permission(req) === true);
	
	// if permission is boolean true, then evaluate the value
	else if (permission === true) return true;
	
	// if permission unspecified or misspecified, return false
	else return false;
}

// function to get user roles and evaluate permissions
function evalACL(resource,operation,req){

	// every request has at least guest role
	var roles = [aclRoles.guest];
	
	// if we have logged user, then assign their roles
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

	// return middleware function for ExpressJS
	return function(req,res,next){
		
		// evaluate permission
		var result = evalACL(resource,operation,req);
		
		// log access
		console.log("ACL " + (result ? "OK" : "XX") + ": " + resource + "/" + operation + (req.user ? " (user: " + req.user._id + "; roles: " + (req.user.roles ? req.user.roles.join(",") : "") + ")" : " (guest)"));
		
		// if permission granted, send execution to the next middleware/route
		if(result) next();
		
		// if permission not granted, then end request with 401 Unauthorized
		else res.status(401).send("Unauthorized" + (req.user ? " (" + req.user._id + ")" : ""));
	}
};