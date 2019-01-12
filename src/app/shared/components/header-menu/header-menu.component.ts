import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'header-menu',
	templateUrl: 'header-menu.component.html',
	styleUrls: ['header-menu.component.css']
})
export class HeaderMenuComponent {

  @Input()
	config;
	 
	public isMenuCollapsed: boolean = true;

	constructor() {
		
	}
}