var Transform = require('stream').Transform;

module.exports = class EventTransformer extends Transform {

	constructor(profileId) {
		// call parent constructor; objectMode:true sets that Transform stream can accept other input than string
		super({objectMode:true});
		
		// save variables to identify import
		this.profileId = profileId;
		
		this.reset();
	}
	
	reset(){
		this.headerNames = {
			"event": ["AKCE","ORG","ORJ"],
			"name": ["AKCE_NAZEV","ORG_NAZEV","ORJ_NAZEV"]
		};

		this.mandatoryFields = ["event","name"];

		this.headerMap = {};

		this.i = 0;
	
	}
	
	_transform(item,enc,next){

		// track row count
		this.i++;
		
		let err = null;

		// track missing madatory fields
		let missingMandatory = [];

		// row one is a header, we want to parse it and make header columns map
		if(this.i === 1){
			Object.keys(this.headerNames).forEach(key => {

				let names = this.headerNames[key];

				let search = names.some(name => {
					this.headerMap[key] = item.indexOf(name);
					if(this.headerMap[key] >= 0) return true;
				});

				if(!search){
					if(this.mandatoryFields.indexOf(key) >= 0)  missingMandatory.push(key);
					else this.emit("warning","Hlavička CSV: nenalezeno volitelné pole " + names.join("/") + ".");
				}
				
			});

			if(missingMandatory.length) err = new Error("Hlavička CSV: nenalezena povinná pole " + missingMandatory.map(key => headerNames[key].join("/")).join(", ") + ".");
			
			return next();
		}

		// make input for database and send it to pipe
		let h = this.headerMap;

		let result = {
			"profile": this.profileId,
			"event": item[h.event],
			"name": item[h.name]
		};
		
		if(!result.name) this.emit("warning","Data: Není vyplněn název u akce číslo " + result.event);
		
		// returned transformed data
		next(err,result.event && result.name ? result : null);
	}
}