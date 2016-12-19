module.exports = function(operation,req){
	
	switch(operation){
			
		case "write": 
			if(req.user && req.user.managedProfiles.indexOf(req.params.id) >= 0) return true;
			console.log(req.user.managedProfiles,req.params.id);
			return false;
			
		default:
			return true;
	}
};