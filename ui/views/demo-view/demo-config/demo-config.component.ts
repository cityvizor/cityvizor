import { Component, Input } from '@angular/core';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

@Component({
	moduleId: module.id,
  selector: 'demo-config',
	templateUrl: 'demo-config.template.html',
	styleUrls: ['demo-config.style.css']
})
export class DemoConfigComponent {
	
	@Input()
	profile:any;
	
	constructor(private dataService:DataService, private toastService:ToastService) {
		this.dataService.getProfile(null).then(profile => this.profile = profile);	
	}

	setData(eventsFile,dataFile){
		this.dataService.saveProfileBudget(eventsFile,dataFile,null)
			.then(() => this.toastService.toast("Data nahrána.","notice"));
	}

}