import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
  selector: 'entity-info-admin',
	templateUrl: 'entity-info-admin.template.html',
	styleUrls: ['entity-info-admin.style.css'],
})
export class EntityInfoAdminComponent {
	
	@Input()
	entity: any;

}