var mongoose = require('mongoose');

var codeListSchema = mongoose.Schema({
	name: String,
	validFrom: Date,
	validTill: Date,
  description: String,
	codeList: mongoose.Schema.Types.Mixed
});
codeListSchema.index({ name: 1 });
codeListSchema.index({ name: 1, validFrom: 1, validTill: 1 });

var CodeList = module.exports = mongoose.model('CodeList', codeListSchema);