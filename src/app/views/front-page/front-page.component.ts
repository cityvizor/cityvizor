import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppConfig, IAppConfig } from 'config/config';

@Component({
	moduleId: module.id,
	selector: 'front-page',
	templateUrl: 'front-page.component.html',
	styleUrls: ['front-page.component.scss']
})
export class FrontPageComponent implements OnInit {

	constructor(private titleService: Title, @Inject(AppConfig) public config: IAppConfig) { }

	ngOnInit() {
		this.titleService.setTitle(this.config.title);
	}

}