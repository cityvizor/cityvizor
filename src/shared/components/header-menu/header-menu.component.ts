import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'header-menu',
	templateUrl: 'header-menu.template.html',
	styleUrls: ['header-menu.style.css']
})
export class HeaderMenuComponent {

  @Input()
	config;
	 
	public isMenuCollapsed: boolean = true;

	constructor() {
		
	}
}