var mongoose = require('mongoose');

var Profile = require("../models/profile");

var etlSchema = mongoose.Schema({
	"profile": { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
	"year": { type: Number, required: true },
	"visible": { type: Boolean, default: false },

	"validity": Date,

	"status": String,
	"error": String

});
etlSchema.index({ profile: 1, year: -1 }, { unique: true });
etlSchema.index({ profile: 1, visible: 1 });

module.exports = mongoose.model('ETL', etlSchema);