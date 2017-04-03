
// initiate variable to store options
var options = {};

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

	// import roles from options
	var aclRoles = options.roles || {};
	
	// var to get all current user roles
	var userRoles = [];
	
	// set default roles
	if(options.defaultRoles) options.defaultRoles.filter(role => aclRoles[role]).map(role => userRoles.push(aclRoles[role]));
	
	// set user roles
	if(req.user && req.user.roles) req.user.roles.filter(role => aclRoles[role]).map(role => userRoles.push(aclRoles[role]));	
	
	console.log();

	return userRoles.some(role => {
		
		// invalid role (e.g. or some you have deleted, but user still has it in his token)
		if(!role) return false;

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

function dynacl(resource,operation){

	// return middleware function for ExpressJS
	return function(req,res,next){

		// evaluate permission
		var result = evalACL(resource,operation,req);

		// log access
		var logString = "ACL " + (result ? "OK" : "XX") + ": " + resource + "/" + operation + (req.user ? " (user: " + req.user._id + "; roles: " + (req.user.roles ? req.user.roles.join(",") : "") + ")" : " (guest)");
		if(options.logConsole) console.log(logString);
		//TODO: logFile

		// if permission granted, send execution to the next middleware/route
		if(result) next();

		// if permission not granted, then end request with 401 Unauthorized
		else res.status(401).send("Unauthorized (" + (req.user ? "logged, no authorization" : "not logged") + ")");

	}
}

// function to configure DynACL
dynacl.config = function(config){
	options = config;
}

module.exports = dynacl;


