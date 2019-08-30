export default {
	
  "users": {
    "read": (req) => req.user.id === req.params.id,
    "write": (req) => req.user.id === req.params.id
  },
  
	"login": {
		"renew": true
	}
	
};