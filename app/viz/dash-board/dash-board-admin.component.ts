import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
  selector: 'dash-board-admin',
	templateUrl: 'dash-board-admin.template.html',
	styles: [],
})
export class DashboardAdminComponent {
	
	@Input()
	profile: any;

}