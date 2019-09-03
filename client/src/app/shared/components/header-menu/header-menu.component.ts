import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'header-menu',
	templateUrl: 'header-menu.component.html',
	styleUrls: ['header-menu.component.scss']
})
export class HeaderMenuComponent {

	@Input() title: string;
	@Input() backLink: string;

	public isMenuCollapsed: boolean = true;

	constructor() {

	}
}