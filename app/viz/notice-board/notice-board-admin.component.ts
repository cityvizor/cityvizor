import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
  selector: 'notice-board-admin',
	templateUrl: 'notice-board-admin.template.html',
	styles: [],
})
export class NoticeBoardAdminComponent {
	
	@Input()
	data: any;

}