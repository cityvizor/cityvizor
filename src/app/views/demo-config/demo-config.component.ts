import { Component, Input } from '@angular/core';

import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

@Component({
  selector: 'demo-config',
	templateUrl: 'demo-config.component.html',
	styleUrls: ['demo-config.component.scss']
})
export class DemoConfigComponent {
	
	@Input()
	profile:any;

	importType:string = "cityvizor";

	public dataService:any;
	
	constructor(dataService:DataService, private toastService:ToastService) {
		this.dataService = dataService;
		this.dataService.getProfile(null).then(profile => this.profile = profile);	
	}

	importDataCityVizor(eventsFile,dataFile){
		this.dataService.saveProfileBudget(eventsFile,dataFile,null)
			.then(() => this.toastService.toast("Data nahrána.","notice"));
	}

	importDataGordic(dataFile){
	
	}

}