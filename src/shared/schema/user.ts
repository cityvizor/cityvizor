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
		* password - used only to set password for sending to user save
		*/
	public password:string;

	/**
		* list of all the entities user has rights to manage
		*/
	public managedProfiles: any[] = [];
	
	/**
		* list of all the roles user has
		*/
	public roles: Array<string>;	
	
	constructor(id?){
		this._id = id;
	}

}