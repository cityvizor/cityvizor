import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppConfig, IAppConfig } from 'config/config';
import { DataService } from 'app/services/data.service';
import { Profile } from 'app/schema';
import { Router } from '@angular/router';

@Component({
	selector: 'frontpage',
	templateUrl: 'frontpage.component.html',
	styleUrls: ['frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {

	mainProfile: Profile | null;
	mainProfileLatestYear: number;

	constructor(private titleService: Title, private dataService: DataService, private router: Router, @Inject(AppConfig) public config: IAppConfig) { }

	ngOnInit() {
		this.titleService.setTitle(this.config.title);

		this.loadMainProfile();

	}

	async loadMainProfile() {

		try {
			this.mainProfile = await this.dataService.getMainProfile();

			const budgets = await this.dataService.getProfileBudgets(this.mainProfile.id);

			this.mainProfileLatestYear = Math.max(...budgets.map(budget => budget.year));
		}
		catch (err) {
			if (err.status !== 404) throw err;
			else this.mainProfile = null;
		}

	}

	openGroup(groupId: string) {
		const params = groupId ? { rok: this.mainProfileLatestYear, skupina: groupId } : { rok: this.mainProfileLatestYear };
		this.router.navigate(["/" + this.mainProfile!.url + "/hospodareni/vydaje", params]); // if opengroup was called mainProfile cannot be null
	}

}