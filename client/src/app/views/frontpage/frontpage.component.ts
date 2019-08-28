import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppConfig, IAppConfig } from 'config/config';

@Component({	
	selector: 'frontpage',
	templateUrl: 'frontpage.component.html',
	styleUrls: ['frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {

	constructor(private titleService: Title, @Inject(AppConfig) public config: IAppConfig) { }

	ngOnInit() {
		this.titleService.setTitle(this.config.title);
	}

}