var mongoose = require('mongoose');

var codeListSchema = mongoose.Schema({
	_id: String,
  description: String,
	codelist: [{
		id: String,
		name: String,
		validFrom: Date,
		validTill: Date
	}]
});
codeListSchema.index({ name: 1, description: 1 });

module.exports = mongoose.model('Codelist', codeListSchema);