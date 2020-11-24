import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ProfileService } from 'app/services/profile.service';
import { Profile } from 'app/schema';
import { DateTime } from 'luxon';

@Component({
	selector: 'profile-invoices',
	templateUrl: 'profile-invoices.component.html',
	styleUrls: ['profile-invoices.component.scss'],
})
export class ProfileInvoicesComponent implements OnInit {

	// params
	profile: Observable<Profile>;
	params: Observable<Params>;

	// data
	invoices: any[] = [];
	loading: boolean = false;

	constructor(private dataService: DataService, private profileService: ProfileService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {

		this.profile = this.profileService.profile;
		this.params = this.route.params;
		
		combineLatest(this.profile, this.params)
			.subscribe(([profile, params]) => {
				if (!profile) return;
				let year = Number(params["rok"]);
				let month = Number(params["mesic"]);
				if (year) this.loadData(profile.id, year, month);
			});
	}

	async loadData(profileId: number, year: number, month?: number) {

		const date = DateTime.fromObject({year: year, month: month ? month : 1, day: 1});

		let params = {
			dateFrom: date.toISODate(),
			dateTo: month ? date.plus({month: 1}).toISODate() : date.plus({year: 1}).toISODate(),
			sort: "date"			
		};

		this.loading = true;
		this.invoices = await this.dataService.getProfilePayments(profileId, params)
		this.loading = false;
	}

}