module.exports = {
	"*": true,
	"profiles": {
		"read": req => {
			req.query.hidden = true;
			return true;
		}
	}
};