module.exports = {
	
  "user": {
    "read": (req) => req.user._id === req.params.id,
    "write": (req) => req.user._id === req.params.id
  },
  
	"login": {
		"renew": true
	}
	
};