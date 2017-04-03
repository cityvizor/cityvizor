import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';
import { UserService } 		from '../../../services/user.service';

@Component({
	moduleId: module.id,
	selector: 'entity-admin-users',
	templateUrl: 'entity-admin-users.template.html',
	styleUrls: [],
})
export class EntityAdminUsersComponent {

	@Input()
	profile: any;	
	 
	users: any[];

	constructor( private dataService: DataService, private toastService: ToastService, private userService:UserService) {
	}
	 
	ngOnInit(){
    this.dataService.getUsers({profile:this.profile._id})
			.then(users => this.users = users);
	}
	 

}
