import { Component, Input } from '@angular/core';

import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'expenditure-events',
	templateUrl: 'expenditure-events.template.html',
	styleUrls: ['expenditure-events.style.css'],
})
export class ExpenditureEventsComponent {

	@Input()
	profile;
	 
	showEE = null;
	
	openEE (ee) {
		if (this.showEE == ee) this.showEE = null;
		else this.showEE = ee;
	}
	 
	viewOptions = {
		"dateOfFirst":this.parseCZDate("01-01-2016"),
		"dateOfLast":this.parseCZDate("31-12-2016"),
		"zoom":"year",
		"amountBubbleMaxSize":200,
		"amountBubbleMinSize":50
	}; 
	 
	nazvyMesice = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];	 
	maxLoremEESumAmount = 5000000;
	LoremEE = [
		{"title":"Oprava silnice","dateOfFirst":"18-06-2016","dateOfLast":"23-08-2016","sumAmount":350000,"ORJ":43857,
			"expeditures":[
				{"title":"položení asfaltu","amount":30000,"date":"18-06-2016","supplier":"METROSTAV"},
				{"title":"terénní práce","amount":100000,"date":"11-07-2016","supplier":"STRABAG"},
				{"title":"instalace osvětlení","amount":200000,"date":"30-07-2016","supplier":"ELTODO a.s."},
				{"title":"kolaudace","amount":50000,"date":"23-08-2016","supplier":"OTP audit s.r.o."}
			]
		},
		{"title":"Rekonstrukce MŠ Vocílkova","dateOfFirst":"11-02-2016","dateOfLast":"21-12-2016","sumAmount":800000,"ORJ":44857,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-02-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		},
		{"title":"Stavba kulutrního centra","dateOfFirst":"11-01-2016","dateOfLast":"21-09-2017","sumAmount":5000000,"ORJ":44857,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-08-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		},
		{"title":"Festival loutkového divadla","dateOfFirst":"11-08-2016","dateOfLast":"21-11-2016","sumAmount":10000,"ORJ":44857,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-0-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		},
		{"title":"Oprava střechy kostela sv. Vavřince","dateOfFirst":"11-04-2016","dateOfLast":"21-06-2016","sumAmount":3700000,"ORJ":44857,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-02-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		},
		{"title":"Zbudování dětského hřiště","dateOfFirst":"11-05-2016","dateOfLast":"21-08-2016","sumAmount":5000,"ORJ":44857,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-02-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		},
		{"title":"Nová zastávka MHD","dateOfFirst":"03-10-2015","dateOfLast":"01-12-2017","sumAmount":1500000,"ORJ":44867,
			"expeditures":[
				{"title":"nová okna","amount":300000,"date":"11-02-2016","supplier":"VEKRA"},
				{"title":"pokládka podlahy","amount":500000,"date":"05-04-2016","supplier":"STRABAG"},
				{"title":"rekonstrukce elektrických rozvodů","amount":800000,"date":"30-06-2016","supplier":"ELTODO a.s."},
				{"title":"nový nábytek","amount":100000,"date":"21-12-2016","supplier":"IKEA"}
			]
		}
	];
	 
	parseCZDate (date) {
		// date format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
		var dt1   = parseInt(date.substring(0,2));
		var mon1  = parseInt(date.substring(3,5));
		var yr1   = parseInt(date.substring(6,10));
		var date1 = new Date(yr1, mon1-1, dt1);
		
		return date1;
	}
	 
	getDateRangeFrac (date) {
		var frac = (this.parseCZDate(date) - this.viewOptions.dateOfFirst) / ( this.viewOptions.dateOfLast - this.viewOptions.dateOfFirst );
		frac = Math.min(1,Math.max(0,frac));
		return frac;
	}
	 
	getAmountBubbleSize(amount) {
		return this.viewOptions.amountBubbleMinSize + (this.viewOptions.amountBubbleMaxSize - this.viewOptions.amountBubbleMinSize ) * amount / this.maxLoremEESumAmount;
	}
	 
	isOverlapToPast(date) {
		var now = this.parseCZDate(date);
		if (now<this.viewOptions.dateOfFirst) return true;
		else return false;
	}
	isOverlapToFuture(date) {
		var now = this.parseCZDate(date);
		if (now > this.viewOptions.dateOfLast) return true;
		else return false;
	}
	 
	constructor() {

	}

}