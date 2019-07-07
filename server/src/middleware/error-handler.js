module.exports = (err, req, res, next) => {

	if (err.name === 'UnauthorizedError') {
		res.status(err.status);
		res.send("Unauthorized" + (err.message ? ": " + err.message : ""));
	}

	else if (err.name === 'JsonSchemaValidation') {
		console.log("Request validation failed. Validation output: " + JSON.stringify(err.validations));
		res.status(400).send("Request validation failed. Validation output: " + JSON.stringify(err.validations));
	}

	else if (err.name === 'MulterError') {
		console.log("Upload Error: " + err.message);
		res.status(400).send("Upload Error: " + err.message);
	}

	else {
		res.status(500).send("Internal Server Error");
		console.error(err.name + ": " + err.message);
	}

};