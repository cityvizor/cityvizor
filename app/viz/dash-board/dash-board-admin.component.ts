import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
  selector: 'dash-board-admin',
	templateUrl: 'dash-board-admin.template.html',
	styleUrls: ['dash-board-admin.style.css'],
})
export class DashboardAdminComponent {
	
	@Input()
	entity: any;

}