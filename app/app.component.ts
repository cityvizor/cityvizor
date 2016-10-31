import { Component } from '@angular/core';

import { DataService } from './services/data.service';

@Component({
	moduleId: module.id,
  selector: 'supervizor-plus',
	templateUrl: 'app.template.html',	
	styleUrls: ['app.style.css'],
	providers: [DataService]
})
export class AppComponent {
	
	menuState: string;
	
	constructor() {}

}