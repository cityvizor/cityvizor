import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Profile } from 'app/schema';
import { DataService } from 'app/services/data.service';
import { ProfileService } from 'app/services/profile.service';
import { combineLatest, Observable } from 'rxjs';
import { CounterpartyDetailModalComponent } from 'app/shared/components/counterparty-detail-modal/counterparty-detail-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';

@Component({
	selector: 'profile-counterparties',
	templateUrl: 'profile-counterparties.component.html',
	styleUrls: ['profile-counterparties.component.scss']
})
export class ProfileCounterpartiesComponent implements OnInit {

	profile: Observable<Profile>;
	params: Observable<Params>;

	counterparties: any[] = [];
	loading: boolean;
	infoWindowClosed: boolean;

	// Save the params to pass them to the Counterparty modal later on 
	year: number;
	month?: number;

	constructor(
		private profileService: ProfileService, 
		private dataService: DataService, 
		private modalService: BsModalService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.params = this.route.params;
		this.profile = this.profileService.profile;

		combineLatest(this.profile, this.params)
			.subscribe(([profile, params]) => {
				if (!profile) return;
				this.year = Number(params["rok"]);
				this.month = params["mesic"] ? Number(params["mesic"]) : undefined;
				this.loadData(profile.id, this.year, this.month);
		});

	}
	async loadData(profileId: number, year: number, month?: number) {

		if (!year) {return;}

		const date = DateTime.fromObject({year, month, day: 1});

		let params = {
			profileId: profileId,
			dateFrom: date.toISODate(),
			dateTo: month ? date.plus({month: 1}).toISODate() : date.plus({year: 1}).toISODate(),
			sort: "date"			
		};

		this.loading = true;
        this.counterparties = await this.dataService.getCounterpartiesTop(params);
        this.loading = false;
	}

	selectCounterparty(counterpartyId: number | null): void {
		if (counterpartyId === null) return;
		this.modalService.show(CounterpartyDetailModalComponent, {initialState: {
			counterpartyId: counterpartyId,
			profileId: String(this.profileService.profileId.getValue()),
			year: this.year,
			month: this.month,
		}})
	}

}