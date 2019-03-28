/**
	* User object to save data concerning current (or other) user
	*/
export class User {

	/** 
		* user's indentification 
		*/
	public _id: string;

	/** 
		* user's email address 
		*/
	public email:string;

	/**
		* list of all the entities user has rights to manage
		*/
	public managedProfiles: any[] = [];
	
	/**
		* list of all the roles user has
		*/
	public roles: Array<string>;	
	
	constructor(id?:string){
		this._id = id;
	}

}