/**
	* User object to save data concerning profile
	*/
export class Entity {

	/** 
		* profile indentification 
		*/
	_id: string;
	name: string;
	gps: [number,number];
	phone: string;
	email: string;
	dataBox: string;
	openHours: {
		"mo":[{from:string,to:string}],
		"tu":[{from:string,to:string}],
		"we":[{from:string,to:string}],
		"th":[{from:string,to:string}],
		"fr":[{from:string,to:string}],
		"sa":[{from:string,to:string}],
		"su":[{from:string,to:string}]
	};
	ico: string;

	address: {
		"street": string,
		"streetNo": string,
		"city": string,
		"postalCode": string
	};
	"edesky": number;
	"mapasamospravy": number	

}