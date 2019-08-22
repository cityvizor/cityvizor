import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../../../services/toast.service';
import { DataService } 		from '../../../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'contract-list',
	templateUrl: 'contract-list.component.html',
	styleUrls: ['contract-list.component.scss'],
})
export class ContractListComponent {

	/* DATA */
	@Input()
	set profile(profile: any){
		if(profile && this.ico !== profile.ico) {
			this.profileId = profile.id;
			this.ico = profile.ico;
			this.loadData();
		}
	}
	
	profileId:string;
	
	ico:string;

	limit = 25;

	loading = false;
	
	contracts:any[] = [];

	infoWindowClosed:boolean;

	constructor(private dataService:DataService, private toastService:ToastService) { }

	loadData(){
		this.dataService.getProfileContracts(this.profileId,{sort:"-date"})
			.then(contracts => this.contracts = contracts)
			.catch(err => this.toastService.toast("error","Nastala chyba při získávání smluv z registru"));
	 }

	parseAmount(string){
		if(string.trim() === "Neuvedeno") return [null,null];
		var matches = string.match(/([\d ]+) ([A-Z]+)/);		
		return [Number(matches[1].replace(/[^\d]/g,"")),matches[2]];
	}

	parseDate(string){
		var matches = string.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
		return new Date(matches[3],matches[2]-1,matches[1]);
	}

	getRegisterUrl(){
		return "https://smlouvy.gov.cz/vyhledavani?publication_date%5Bfrom%5D=&publication_date%5Bto%5D=&subject_name=&subject_box=&subject_idnum=" + this.ico + "&subject_address=&value_foreign%5Bfrom%5D=&value_foreign%5Bto%5D=&foreign_currency=&contract_id=&party_name=&party_box=&party_idnum=&party_address=&value_no_vat%5Bfrom%5D=&value_no_vat%5Bto%5D=&file_text=&version_id=&contr_num=&sign_date%5Bfrom%5D=&sign_date%5Bto%5D=&contract_descr=&sign_person_name=&value_vat%5Bfrom%5D=&value_vat%5Bto%5D=&all_versions=0&search=Vyhledat&do=detailedSearchForm-submit#snippet-searchResultList-list";
	}
}