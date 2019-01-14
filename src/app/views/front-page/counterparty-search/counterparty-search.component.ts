import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';


import { Counterparty } from 'app/shared/schema/counterparty';

@Component({
	moduleId: module.id,
	selector: 'counterparty-search',
	templateUrl: 'counterparty-search.component.html',
	styleUrls: ['counterparty-search.component.scss']
})
export class CounterpartySearchComponent implements OnInit {

	results: any[];

	supplierQuery: string = '';
	supplierQueryFocus: boolean = false;
	supplierSelected: number = 0;

	topCounterparties:Counterparty[];
	wordcloud:Array<[string,number]> = [];

	constructor(private dataService: DataService, private toastService: ToastService, private router:Router) { }

	ngOnInit(){
		this.loadTopCounterparties();
	}

	async loadTopCounterparties(){
		const counterparties = await this.dataService.getCounterpartiesTop();

		const replaced = ["spol\\. s r\\.o\\.", "a\\. ?s\\.", "s\\.? ?r\\. ?o\\.", "JUDR\\.", "příspěvková organizace", ","].map(string => new RegExp(string, "i"));

		counterparties.forEach(counterparty => {
      replaced.forEach(replace => counterparty.name = counterparty.name.replace(replace, ""))
      counterparty.name = counterparty.name.trim();
		})

		this.topCounterparties = counterparties;

		this.wordcloud = this.topCounterparties.map(counterparty => [counterparty.name,counterparty.amount] as [string,number]);

	}

	openCounterparty(counterpartyId:string){
		this.router.navigate(["/dodavatele",counterpartyId]);
	}

	querySupplier(query:string) {
		this.supplierSelected = 0;

		if (query!='') this.supplierQueryFocus=true;

		this.dataService.searchCounterparties(query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.", "error"));
	}

	selectSupplier(direction:string) {
		if (direction == 'up' && this.supplierSelected>0) this.supplierSelected--;
		if (direction == 'down' && this.supplierSelected<(this.results.length-1)) this.supplierSelected++;
		if (direction == 'route' && this.supplierQueryFocus) {
			this.router.navigate(['/dodavatele/' + this.results[this.supplierSelected].counterpartyId]);
		}
	}
}
