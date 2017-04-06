import { Component } from '@angular/core';

import { DataService } 		from '../../../services/data.service';

import { User } from "../../../shared/schema/user";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-users',
	templateUrl: 'site-admin-users.template.html',
	styleUrls: []
})
export class SiteAdminUsersComponent {
  
  // variable to store users
  users:any[] = [];

	constructor(private dataService: DataService) {
		
	}
  
  ngOnInit(){
    // load users and save to local variable
    this.dataService.getUsers()
      .then(users => {
        this.users = users;
        this.users.sort((a,b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));
      });
  }

}