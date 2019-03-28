/**
	* User object to save data concerning profile
	*/
export class Profile {

	/** 
		* profile indentification 
		*/
	_id: string;

	"active": boolean;
	"url": string;
	"name": string;
	"entity": any;
	"hiddenModules": string[];
	"gps": [number,number];
	"ico": string;
	"edesky": number;
	"mapasamospravy": number	

}