import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'help-modal',
	templateUrl: 'help-modal.template.html',
	styleUrls: ['help-modal.style.css']
})
export class HelpModalComponent {

	@Input() topic:String;
	
	public isModalOpened: boolean = false;
	 
	constructor() {}


}