import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

export class User {

	public login: string;
	public managedEntities: Array<string>;
	public roles: Array<string>;

}

@Injectable()
export class UserService {

	user: User;

	constructor(private _http:Http){
		
	}

	login(login:string, password:string){
		return this._http.get("/api/entities").toPromise()
			.then(response => response.json())
			.then(user => this.user = user)
			.catch(() => this.user = null);
	}
}