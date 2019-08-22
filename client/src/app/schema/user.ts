/**
	* User object to save data concerning current (or other) user
	*/
export interface User {

	id: string;

	login:string;

	/**
		* list of all the entities user has rights to manage
		*/
	managedProfiles: any[];
	
	/**
		* list of all the roles user has
		*/
	roles: Array<string>;	

}