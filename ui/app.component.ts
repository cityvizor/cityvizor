import { Component, ViewContainerRef, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';

import { AppConfig, IAppConfig } from './config/config';

@Component({
	moduleId: module.id,
	selector: 'cityvizor-app',
	templateUrl: 'app.template.html',
	styleUrls: ['app.style.css'],
	animations: [
		trigger("toastsFadeOut", [
			transition(':leave', animate(250, style({opacity: 0}))) // * => void
		])
	]
})
export class AppComponent {

	private viewContainerRef: ViewContainerRef; // ng2-bootstrap requirement

	// array to link toasts from toastService
	toasts: Array<any>;


	constructor(private toastService: ToastService, private router:Router, @Inject(AppConfig) public config:IAppConfig) {
		this.toasts = this.toastService.toasts;
	}

}