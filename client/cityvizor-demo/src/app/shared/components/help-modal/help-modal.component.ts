import { Component, Input } from '@angular/core';

@Component({
	selector: 'help-modal',
	templateUrl: 'help-modal.component.html',
	styleUrls: ['help-modal.component.scss']
})
export class HelpModalComponent {

	@Input() topic:String;
	
	public isModalOpened: boolean = false;
	 
	constructor() {}


}