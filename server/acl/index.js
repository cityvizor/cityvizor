function getACL(subject,operation,req){
	
	switch(subject){

		case "profile": 
			return require("./profile.js")(operation,req);

		default: 
			return true;
			
	}
	
}


module.exports = function(subject,operation){
	
	return function(req,res,next){
		
		var result = getACL(subject,operation,req);
		
		console.log("ACL " + (result ? "OK" : "XX") + ": " + subject + "/" + operation);
		
		if(result) next();
		else res.sendStatus(401);
												
	}

};