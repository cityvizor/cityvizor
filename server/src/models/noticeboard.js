var mongoose = require('mongoose');

var noticeBoardSchema = mongoose.Schema({
	
	edesky: String,
	
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile", index:true},

	documents: [{
		
		date: Date,
		title: String,
		category: String,

		documentUrl: String,
		edeskyUrl: String,
		previewUrl: String,

		attachments: [{
			name: String,
			url: String,
			mime: String
		}]
		
	}]
	
});

var NoticeBoard = module.exports = mongoose.model('NoticeBoard', noticeBoardSchema);