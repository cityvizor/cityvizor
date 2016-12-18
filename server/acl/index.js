
module.exports = function(subject,operation,parameters){
	
	return function(req,res,next){
		
		console.log("ACL: " + subject + "/" + operation + (parameters ? "(" + JSON.stringify(paarameters) + ")" : ""));
		next();
	};

};