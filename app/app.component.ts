import { Component } from '@angular/core';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';

@Component({
	moduleId: module.id,
  selector: 'supervizor-plus',
	templateUrl: 'app.template.html',	
	styleUrls: ['app.style.css'],
	providers: [ DataService ]
})
export class AppComponent {
	
	toasts: Array<any>;
	
	year: string;
	
	constructor(private _toastService: ToastService) {
		var today = new Date();
		this.year = today.getFullYear() == 2016 ? "2016" : "2016 ~ " + today.getFullYear();
		
		this.toasts = this._toastService.toasts;
	}

}