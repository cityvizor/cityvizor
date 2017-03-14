import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';

import { ToastService } 		from '../../services/toast.service';
import { YQLService } 		from '../../services/yql.service';

@Component({
	moduleId: module.id,
	selector: 'contract-list',
	templateUrl: 'contract-list.template.html',
	styleUrls: ['contract-list.style.css'],
})
export class ContractListComponent {

	/* DATA */
	@Input()
	set profile(profile: any){
		if(profile && this.ico !== profile.entity.ico) {
			this.ico = profile.entity.ico;
			this.loadData();
		}
	}
	
	ico:string;

	limit = 25;

	loading = false;
	
	contracts:any[] = [];

	infoWindowClosed:boolean;

	constructor(private yql:YQLService, private toastService:ToastService) { }

	loadData(){
		
		var query = "select * from html where url='https://smlouvy.gov.cz/vyhledavani?searchResultList-limit=" + this.limit + "&do=searchResultList-setLimit&subject_idnum=" + this.ico + "&all_versions=0' and xpath='//*[@id=\"snippet-searchResultList-list\"]/table/tbody/tr'";
		
		this.loading = true;
		
		this.yql.query(query)
			.then(data => {
			
				this.loading = false;
			
				data.query.results.tr.forEach(row => {
					let amount = this.parseAmount(row.td[4].content);
					let contract = {
						"publisher": row.td[0].content.trim(),
						"name":  row.td[1].content.trim(),
						"published": this.parseDate(row.td[3].content),
						"amount": amount[0],
						"currency": amount[1],
						"counterparty": row.td[5].content.trim(),
						"url": "https://smlouvy.gov.cz" + row.td[6].a.href
					};
					this.contracts.push(contract);
				});
				this.loading = false;
			})
			.catch(err => {
				this.toastService.toast("Nastala chyba při stahování dat z registru smluv","error");
			});
		 
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