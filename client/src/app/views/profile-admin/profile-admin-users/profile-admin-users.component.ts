import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-users',
	templateUrl: 'profile-admin-users.component.html',
	styleUrls: [],
})
export class ProfileAdminUsersComponent {

	@Input()
	profile: any;	
	 
	managers: any[];

	constructor( private dataService: DataService, private toastService: ToastService) {
	}
	 
	ngOnInit(){
    this.dataService.getProfileManagers(this.profile.id)
			.then(managers => this.managers = managers);
	}
	 

}
