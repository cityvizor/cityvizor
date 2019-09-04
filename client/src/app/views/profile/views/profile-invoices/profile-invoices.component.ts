import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, Observable, combineLatest } from 'rxjs';

import { DataService } from 'app/services/data.service';
import { ProfileService } from 'app/services/profile.service';
import { Profile } from 'app/schema';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
	selector: 'profile-invoices',
	templateUrl: 'profile-invoices.component.html',
	styleUrls: ['profile-invoices.component.scss'],
})
export class ProfileInvoicesComponent implements OnInit {
	// settings
	monthNames: string[] = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

	// params
	profile: Observable<Profile>;
	params: Observable<Params>;

	// data
	invoices: any[] = [];
	months: { [year: number]: number[] } = {};
	years: number[] = [];

	// current view
	currentYear: number;
	currentMonth: number;

	loading: boolean = false;


	constructor(private dataService: DataService, private profileService: ProfileService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {

		this.profile = this.profileService.profile;

		this.params = this.route.params;

		this.profile.subscribe(profile => this.loadMonths(profile.id))

		combineLatest(this.profile, this.params)
			.subscribe(([profile, params]) => {

				if (!profile) return;

				let year = Number(params["rok"]);
				let month = Number(params["mesic"]);

				this.currentYear = year;
				this.currentMonth = month;

				if (year && month) this.loadData(profile.id, year, month);

			});
	}

	async loadMonths(profileId) {

		const months = await this.dataService.getProfilePaymentsMonths(profileId);

		this.months = {};

		months.forEach(month => {
			if (!month.month || !month.year) return;
			if (!this.months[month.year]) this.months[month.year] = [];
			this.months[month.year].push(month.month);
		});

		this.years = Object.keys(this.months).map(year => Number(year));

		this.years.sort((a, b) => b - a);

		if (!this.currentYear) this.selectMonth(this.years[this.years.length - 1], Math.max(...this.months[this.years[this.years.length - 1]]));
		else if (!this.currentMonth) this.selectMonth(this.currentYear, 1);

	}

	async loadData(profileId: number, year: number, month: number) {

		const date = DateTime.fromObject({year, month, day: 1});

		let params = {
			dateFrom: date.toISODate(),
			dateTo: date.plus({month: 1}).toISODate(),
			sort: "date"			
		};

		this.loading = true;
		this.invoices = await this.dataService.getProfilePayments(profileId, params)
		this.loading = false;
	}

	selectYear(year: number): void {
		this.router.navigate(this.getYearLink(year), { relativeTo: this.route, replaceUrl: !this.currentYear });
	}
	selectMonth(year: number, month: number): void {
		this.router.navigate(this.getMonthLink(year, month), { relativeTo: this.route, replaceUrl: !this.currentYear || !this.currentMonth });
	}

	getYearLink(year: number): any {
		return this.getMonthLink(year, Math.min(...this.months[year]));
	}
	getMonthLink(year: number, month: number): any {
		return ["./", { "rok": year, "mesic": month }];
	}

	isMonthDisabled(year: number, month: number) {
		if (!this.months[year]) return true;
		if (this.months[year].indexOf(month) === -1) return true;
		return false;
	}
}