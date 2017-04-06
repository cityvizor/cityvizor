/**
	* User object to save data concerning profile
	*/
export class Profile {

	/** 
		* profile indentification 
		*/
	_id: string;

	active: boolean;
	url: string;
	name: string;
	entity: string|Object;
	hiddenModules: string[];

}