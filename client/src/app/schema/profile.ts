/**
	* User object to save data concerning profile
	*/
export class Profile {

	/** 
		* profile indentification 
		*/
	id: string;

	status: "visible" | "hidden" | "pending";

	url: string;
	name: string;
	entity: any;
	gpsX: number;
	gpsY: number;
	ico: string;
	edesky: number;
	mapasamospravy: number;

}