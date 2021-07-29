import { Component, Input, OnInit } from '@angular/core';

import { ToastService } from 'app/services/toast.service';
import { DataService } from 'app/services/data.service';
import { Profile } from 'app/schema';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProfileService } from 'app/services/profile.service';
import { profile } from 'console';

@Component({
	selector: 'profile-contracts',
	templateUrl: 'profile-contracts.component.html',
	styleUrls: ['profile-contracts.component.scss'],
})
export class ProfileContractsComponent implements OnInit {

	profile: Profile;

	loading: boolean = false;
	infoWindowClosed: boolean = false;

	contracts: any[] = [];

	constructor(private profileService: ProfileService, private dataService: DataService) { }

	ngOnInit() {
		this.profileService.profile.subscribe(profile => {
			this.profile = profile;
			this.loadData(profile.id);
		});
	}

	async loadData(profileId: number) {
		this.loading = true;
		this.contracts = await this.dataService.getProfileContracts(profileId, { sort: "-date" })
		this.loading = false;
	}

	parseAmount(string: string): [number | null, string | null] {

		if (string.trim() === "Neuvedeno") return [null, null];

		var matches = string.match(/([\d ]+) ([A-Z]+)/);

		if (matches) return [Number(matches[1].replace(/[^\d]/g, "")), matches[2]];
		else return [null, null];

	}

	parseDate(string: string): Date | undefined {
		var matches = string.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
		if (matches) return new Date(Number(matches[3]), Number(matches[2]) - 1, Number(matches[1]));
		else return undefined;
	}

	getRegisterUrl() {
		if (this.profile.databox) {
			return `https://smlouvy.gov.cz/vyhledavani?publication_date%5Bfrom%5D=&publication_date%5Bto%5D=&subject_name=&subject_box=&subject_box=${this.profile.databox}&subject_address=&value_foreign%5Bfrom%5D=&value_foreign%5Bto%5D=&foreign_currency=&contract_id=&party_name=&party_box=&party_idnum=&party_address=&value_no_vat%5Bfrom%5D=&value_no_vat%5Bto%5D=&file_text=&version_id=&contr_num=&sign_date%5Bfrom%5D=&sign_date%5Bto%5D=&contract_descr=&sign_person_name=&value_vat%5Bfrom%5D=&value_vat%5Bto%5D=&all_versions=0&search=Vyhledat&do=detailedSearchForm-submit#snippet-searchResultList-list`;
		} else if (this.profile.ico) {
			return `https://smlouvy.gov.cz/vyhledavani?publication_date%5Bfrom%5D=&publication_date%5Bto%5D=&subject_name=&subject_box=&subject_idnum=${this.profile.ico}&subject_address=&value_foreign%5Bfrom%5D=&value_foreign%5Bto%5D=&foreign_currency=&contract_id=&party_name=&party_box=&party_idnum=&party_address=&value_no_vat%5Bfrom%5D=&value_no_vat%5Bto%5D=&file_text=&version_id=&contr_num=&sign_date%5Bfrom%5D=&sign_date%5Bto%5D=&contract_descr=&sign_person_name=&value_vat%5Bfrom%5D=&value_vat%5Bto%5D=&all_versions=0&search=Vyhledat&do=detailedSearchForm-submit#snippet-searchResultList-list`;
		}
	}
}